const io = require('socket.io')(8080, {
  path: '/'
});

io.set('origins', '*:*');
io.on('connection', socket => {
  socket.emit('message', 'Hey Client!');
  socket.on('message', message => {
    console.log(message);
  });
});
io.on('message', message => {
  console.log(message);
});

module.exports = io;
