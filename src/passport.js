/* eslint-disable no-undef */
const LocalStrategy = require('passport-local');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const JwtStrategy = require('passport-jwt').Strategy;
// eslint-disable-next-line prefer-destructuring
const ExtractJwt = require('passport-jwt').ExtractJwt;
const pool = require('../db');
const { secret } = require('../config.json');

const localOptions = { usernameField: 'email' };
// TODO - USE pool.query instead
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  pool
    .connect()
    .then(client => {
      const getPersonQuery = 'SELECT * FROM auth_user WHERE email = ($1)';
      const getPersonParams = [email];
      client
        .query(getPersonQuery, getPersonParams)
        .then(result => {
          if (!result.rows[0]) done(null, false);
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
          console.log(err);
          client.release();
        });
    })
    .catch(err => {
      console.log(`Encountered unknown error: ${err}`);
    });
});
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: secret
};
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  const query = {
    name: 'find-person',
    text: 'SELECT * FROM auth_user WHERE email = ($1)',
    values: [payload.sub.id]
  };
  pool.query(query, (err, result) => {
    if (err) {
      console.log('ERR');
      done(err, false);
    }
    if (result) {
      console.log('SUCCESS');
      done(null, true);
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);
