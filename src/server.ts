require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import { AppRouter } from './AppRouter';
import morgan from 'morgan';
import cors from 'cors';
import { Socket } from 'socket.io';
import { createConnection } from 'typeorm';
import './controllers/rootController';
import './controllers/authController';
import './controllers/personController';
import './controllers/friendController';
import './controllers/chatController';

const SocketIO = require('./WebSocket')

createConnection().then(() => {
	const app = express();
	const io = SocketIO.getInstance(app)
	io.on('connection', (socket: Socket) => {
		socket.emit('message', 'Hey Client!');
		socket.on('message', (message: string) => {
			console.log(message);
		});
	});
	app.use(cors());
  app.use(morgan(':method :url :status :response-time ms'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ type: '*/*' }));
  app.use(AppRouter.getInstance());
  app.listen(process.env.PORT);
});