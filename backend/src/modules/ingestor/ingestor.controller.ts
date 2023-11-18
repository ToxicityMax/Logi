import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { IngestorService } from './ingestor.service';
import { LogDTO, LogSearchResultDto, SearchBodyDto } from './dto/ingestory.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Ingestor')
@Controller('ingestor')
export class IngestorController {
  constructor(private readonly ingestorService: IngestorService) {}

  @Post('')
  async addLog(@Body(ValidationPipe) logData: LogDTO) {
    return this.ingestorService.addLog(logData);
  }
  @Post('/bulk')
  async addBulkLogs(@Body(ValidationPipe) logsData: LogDTO[]) {
    return this.ingestorService.addBulkLogs(logsData);
  }

  @Post('/json-file')
  @UseInterceptors(FileInterceptor('file'))
  async addJsonLogs(@UploadedFile() file: Express.Multer.File) {
    return this.ingestorService.addJsonFileLogs(file);
  }

  @Post('/search')
  @ApiOperation({ summary: 'Search API for logs' })
  @ApiResponse({
    status: 200,
    description: 'Returns the search results',
    type: LogSearchResultDto,
  })
  async searchLogs(@Body(ValidationPipe) searchBodyData: SearchBodyDto) {
    return this.ingestorService.searchLogs(
      searchBodyData.filters,
      +searchBodyData.page,
      searchBodyData.limit,
    );
  }
}
