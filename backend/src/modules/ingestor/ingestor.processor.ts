import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectModel } from '@nestjs/mongoose';
import { LogDocument } from './ingestor.entity';
import { Model } from 'mongoose';
import { Logger } from '@nestjs/common';
import { LogDTO } from './dto/ingestory.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Processor('LOGS_QUEUE')
export class LogProcessor {
  constructor(
    @InjectModel('Log') private readonly logDB: Model<LogDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  private readonly logger = new Logger(LogProcessor.name);

  @Process()
  async handleLog(job: Job<LogDTO>) {
    const logData = job.data;
    try {
      const newLog = new this.logDB(logData);
      await newLog.save();
      this.eventEmitter.emit('log.created', newLog);
      this.logger.debug('Log processed successfully');
    } catch (error) {
      this.logger.error(`Failed to process log: ${error.message}`);
    }
  }

  @Process('handleBulkLogs')
  async handleBulkLogs(job: Job<LogDTO[]>) {
    const logData = job.data;
    try {
      const logsToInsert = logData.map((data) => new this.logDB(data));
      await this.logDB.insertMany(logsToInsert);
      //Todo-> handle this to support multiple logs and send it to websocket
      this.eventEmitter.emit('log.created', logsToInsert);
      this.logger.debug('Bulk Log processed successfully');
    } catch (error) {
      this.logger.error(`Failed to process log: ${error.message}`);
    }
  }
}
