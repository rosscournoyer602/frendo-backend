const io = require('socket.io')(process.env.PORT);

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
