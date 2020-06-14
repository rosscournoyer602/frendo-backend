const socketIO = require('socket.io');

let websocket = null;

class WebSocket {
  static getInstance(app) {
    if (app && !websocket) {
      websocket = socketIO(app);
    }
    return websocket;
  }
}

module.exports = WebSocket;
