/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jwt-simple');
const pool = require('../db');

function tokenForUser(userEmail) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: userEmail, iat: timestamp }, process.env.SECRET);
}

module.exports = {
  signup: (req, res) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, null, async (err, hash) => {
        const query = {
          name: 'signup-user',
          text: 'INSERT INTO auth_user (email, password_hash) VALUES ($1, $2)',
          values: [req.body.email, hash]
        };
        try {
          await pool.query(query);
          res.status(200).json({ token: tokenForUser(req.body.email) });
        } catch (error) {
          res.status(400).send('Duplicate email');
        }
      });
    });
  },
  signin: (req, res) => {
    // user has had their email and password authed using passport.js local strategy
    // we just need to give them a token
    res.send({ token: tokenForUser(req.user) });
  }
};
