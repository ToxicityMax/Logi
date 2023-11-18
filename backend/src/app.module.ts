import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { IngestorModule } from './modules/ingestor/ingestor.module';
import { BullModule } from '@nestjs/bull';
import { WsGatewayModule } from './modules/ws-gateway/ws-gateway.module';

@Module({
  imports: [
    MongooseModule.forRoot(config.DB_URI),
    IngestorModule,
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: '127.0.0.1',
          port: 6379,
        },
      }),
    }),
    WsGatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
