/* eslint-disable no-undef */
const LocalStrategy = require('passport-local');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const pool = require('../db');
// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;

const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  pool
    .connect()
    .then(client => {
      const getPersonQuery = 'SELECT * FROM auth_user WHERE email = ($1)';
      const getPersonParams = [email];
      client
        .query(getPersonQuery, getPersonParams)
        .then(result => {
          bcrypt.compare(password, result.rows[0].password_hash, (err, compare) => {
            if (compare === true) {
              done(null, { id: result.rows[0].email });
              client.release();
            }
            if (compare === false) {
              done(null, false);
              client.release();
            }
          });
        })
        .catch(err => {
          res.send(err);
          client.release();
        });
    })
    .catch(err => {
      res.send(`Encountered unknown error: ${err}`);
      client.release();
    });
});

passport.use(localLogin);
