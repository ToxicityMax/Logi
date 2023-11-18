import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { Log } from '../ingestor/ingestor.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WsGateway {
  constructor() {}
  @WebSocketServer()
  server: Server;

  @OnEvent('log.created')
  handleLogCreated(data: Log) {
    this.server.emit('log.created', data);
  }

  // onModuleInit(): any {
  //   this.server.on('connection', (socket) => {
  //     console.log(socket.id);
  //     console.log('connected');
  //   });
  // }
  //
  // @SubscribeMessage('NEW_LOGS')
  // handleNewLogs(@MessageBody() body: any) {
  //   console.log(body);
  // }
}
