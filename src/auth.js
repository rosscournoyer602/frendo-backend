/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jwt-simple');
const pool = require('../db');
const { secret } = require('../config.json');

function tokenForUser(userEmail) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: userEmail, iat: timestamp }, secret);
}

module.exports = {
  signup: (req, res) => {
    pool
      .connect()
      .then(client => {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, null, (err, hash) => {
            const addPersonQuery = 'INSERT INTO auth_user (email, password_hash) VALUES ($1, $2)';
            const addUserParams = [req.body.email, hash];
            client
              .query(addPersonQuery, addUserParams)
              .then(() => {
                tokenForUser();
                res.status(200).json({ token: tokenForUser(req.body.email) });
                client.release();
              })
              .catch(err => {
                res.status(403).send(err.detail);
                client.release();
              });
          });
        });
      })
      .catch(err => {
        res.send(`Encountered unknown error: ${err}`);
        // client.release();
      });
  },
  signin: (req, res) => {
    console.log('I was called:', res);
    // user has had their email and password authed using passport.js local strategy
    // we just need to give them a token
    res.send({ token: tokenForUser(req.user) });
  }
};
