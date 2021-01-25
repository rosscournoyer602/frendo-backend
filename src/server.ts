require('dotenv').config()
import express from 'express'
import bodyParser from 'body-parser'
import { AppRouter } from './AppRouter'
import morgan from 'morgan'
import cors from 'cors'
import { createServer, Server } from 'http'
import { createConnection } from 'typeorm'
const socketIO = require('./WebSocket')

import './controllers/rootController'
import './controllers/authController'
import './controllers/personController'
import './controllers/friendController'
import './controllers/chatController'

createConnection().then(() => {
	const app = express()
	app.use(cors())
  app.use(morgan(':method :url :status :response-time ms'))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json({ type: '*/*' }))
	app.use(AppRouter.getInstance());
	const httpServer = createServer(app)
	socketIO.connect(httpServer)
	const io = socketIO.connection()
	console.log('AIOIO', io)
  httpServer.listen(process.env.PORT)
});