import { HttpException, Injectable } from '@nestjs/common';
import { FilterDTO, LogDTO, LogSearchResultDto } from './dto/ingestory.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LogDocument } from './ingestor.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Log } from './ingestor.interface';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class IngestorService {
  constructor(
    @InjectModel('Log') private readonly logDB: Model<LogDocument>,
    @InjectQueue('LOGS_QUEUE') private logsQueue: Queue,
  ) {}
  async addLog(logData: LogDTO) {
    //Add the log in Queue
    await this.logsQueue.add(logData);
    throw new HttpException('Success', 201);
  }

  async addBulkLogs(logsData: LogDTO[]) {
    await this.logsQueue.add('handleBulkLogs', logsData);
    throw new HttpException('Success', 201);
  }

  async addJsonFileLogs(file: Express.Multer.File) {
    const data = file.buffer.toString();
    const parsedData = JSON.parse(data);
    const logsData: LogDTO[] = parsedData.map((item: any) =>
      plainToClass(LogDTO, item),
    );
    for (const log of logsData) {
      const error = await validate(log); // Validate each log
      if (error.length > 0) {
        throw new HttpException(
          'Validation error file content not as expected',
          400,
        );
      }
    }
    await this.addBulkLogs(logsData);
  }

  async searchLogs(
    searchData: FilterDTO,
    page: number = 1,
    limit: number = 10,
  ): Promise<LogSearchResultDto> {
    // Create Search Filters based on query data
    const qFilters = this.createSearchFilter(
      searchData.searchText,
      searchData.startDate,
      searchData.endDate,
    );
    // Search Db with filters and paginations
    const results: Log[] = await this.logDB
      .find(qFilters)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Count total no. of search results
    const totalCount = await this.logDB.countDocuments(qFilters);
    const payload = new LogSearchResultDto();
    payload.results = results;
    payload.totalCount = totalCount;
    payload.currentPage = page;
    payload.totalPages = Math.ceil(totalCount / limit);
    return payload;
  }

  createSearchFilter(searchQuery: string, startDate?, endDate?) {
    // Parse and handle query syntax
    const filter = {};
    if (!searchQuery) return filter;
    try {
      const rawQueryList = searchQuery.trim().split(' ');
      const queryList = rawQueryList.map((rawQuery) => {
        const query = rawQuery.split(':');
        return {
          key: query[0].replace(/^'(.*)'$/, '$1'),
          val: query[1].replace(/^'(.*)'$/, '$1'),
        };
      });
      queryList.forEach((query) => {
        // Cases
        // Full text search Keyword
        if (query.key == 'fts') {
          filter['$text'] = { $search: query.val };
        }
        // r'' for regular expression'
        else if (
          query.val.slice(0, 2) == "r'" &&
          query.val[query.val.length - 1] == "'"
        ) {
          filter[query.key] = {
            $regex: new RegExp(query.val.slice(2, query.val.length - 1)),
          };
        }
        // multiple filters. Ex: level:error,success,warnd
        else if (query.val.includes(',')) {
          filter[query.key] = { $in: query.val.split(',') };
        }
        // Starts with search. Ex: level:*err
        else if (query.val[0] == '*') {
          filter[query.key] = {
            $regex: new RegExp('^' + query.val.slice(1, query.val.length)),
          };
        }
        // Starts with search. Ex: level:err*
        else if (query.val[query.val.length - 1] == '*') {
          filter[query.key] = {
            $regex: new RegExp(query.val.slice(0, query.val.length - 1) + '$'),
          };
        }
        //Normal query
        else filter[query.key] = query.val;
      });
    } catch (e) {
      throw new HttpException('Failed to parse query', 400);
    }

    // Create timestamp filters
    if (startDate && endDate)
      filter['timestamp'] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    return filter;
  }
}
