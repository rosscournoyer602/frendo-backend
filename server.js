const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');

app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);
  
app.listen(8080);