const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./router');

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*', limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
router(app);

app.listen(process.env.PORT || 8080);
