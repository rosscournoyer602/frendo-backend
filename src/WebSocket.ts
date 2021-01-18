import { Server } from 'socket.io'
import { createServer } from 'http'
import { Express } from 'express'

let websocket: Server;

class WebSocket {
  static getInstance(app: Express): Server {
    if (app && !websocket) {
			const http = createServer(app)
      websocket = new Server(http);
    }
    return websocket;
  }
}

module.exports = WebSocket;