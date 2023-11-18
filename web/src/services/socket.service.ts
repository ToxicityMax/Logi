import {io} from 'socket.io-client';

class SocketIoService {
  public socket: any;

  constructor() {}

  makeConnection() {
    this.socket = io(import.meta.env.VITE_BASE_URL)
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketIoService();
