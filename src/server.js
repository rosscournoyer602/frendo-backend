require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
// const cors = require('cors');
const router = require('./router');

const app = express();

// app.disable('etag');
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*', limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
router(app);

app.listen(process.env.PORT || 8080);
