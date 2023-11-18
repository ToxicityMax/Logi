import { Module } from '@nestjs/common';
import { WsGateway } from './ws-gateway';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [WsGateway],
})
export class WsGatewayModule {}
