import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class SocketService {
  constructor(private socket: Socket) {}
  getMessage(cb) {
    return this.socket.on('new_message', data => {
      cb(data);
    });
  }

  connect() {
    return this.socket.connect();
  }

  disconnect() {
    return this.socket.disconnect();
  }
}
