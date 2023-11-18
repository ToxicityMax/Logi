import {io, Socket} from 'socket.io-client';

class SocketIoService{
  public socket: any;
  constructor() {
  }
  makeConnection(){
    this.socket = io('http://localhost:3000')}

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketIoService();
