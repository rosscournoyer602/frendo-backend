/* eslint-disable no-console */
const passport = require('passport');
const pool = require('../db');
// eslint-disable-next-line no-unused-vars
const passportService = require('./passport');
const { signup, signin } = require('./auth');
const { addPerson, getPerson } = require('./person');

const requireSignin = passport.authenticate('local', { session: false });

module.exports = app => {
  app.get('/', (req, res) => {
    res.status(200).send('Hello There!');
  });

  // Need route to get specific person
  app.get('/people', (req, res) => {
    // eslint-disable-next-line consistent-return
    pool.query('SELECT * FROM person', (err, result) => {
      if (err) return console.log(err);
      res.status(200).send(result.rows);
    });
  });

  app.get('/person', getPerson);

  app.post('/addperson', addPerson);

  app.post('/signup', signup);

  app.post('/signin', requireSignin, signin);
};
