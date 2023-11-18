import { Module } from '@nestjs/common';
import { IngestorController } from './ingestor.controller';
import { IngestorService } from './ingestor.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LogSchema } from './ingestor.entity';
import { BullModule } from '@nestjs/bull';
import { LogProcessor } from './ingestor.processor';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    MongooseModule.forFeature([{ schema: LogSchema, name: 'Log' }]),
    BullModule.registerQueue({
      name: 'LOGS_QUEUE',
    }),
  ],
  controllers: [IngestorController],
  providers: [IngestorService, LogProcessor],
})
export class IngestorModule {}
