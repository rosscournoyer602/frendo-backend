require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./router');
const socketIO = require('./websocket');

const app = express();
// eslint-disable-next-line import/order
const server = require('http').Server(app);

app.disable('etag');
app.use(cors({ origin: 'http://friendo.herokuapp.com', credentials: true }));
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*', limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
router(app);
const io = socketIO.getInstance(server);
io.set('origins', 'http://friendo.herokuapp.com');
io.on('connection', socket => {
  socket.emit('message', 'Hey Client!');
  socket.on('message', message => {
    console.log(message);
  });
});
io.on('message', message => {
  console.log(message);
});

server.listen(process.env.PORT);
