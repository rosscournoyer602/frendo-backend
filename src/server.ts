require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import { AppRouter } from './AppRouter';
import morgan from 'morgan';
import cors from 'cors';
import { createConnection } from 'typeorm';
import './controllers/rootController';
import './controllers/authController';
import './controllers/personController';

createConnection().then(() => {
  const app = express();
	app.use(cors());
  app.use(morgan('combined'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ type: '*/*' }));
  app.use(AppRouter.getInstance());
  app.listen(process.env.PORT);
});