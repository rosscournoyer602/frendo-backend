/* eslint-disable no-multi-str */
const AWS = require('aws-sdk');
const pool = require('../db');

const s3 = new AWS.S3();

module.exports = {
  addPerson: (req, res) => {
    const query = {
      name: 'add-person',
      text:
        'INSERT INTO person\
            (first_name, last_name, dob, street_address, city, state_province, phone, email)\
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      values: [
        req.body.first_name,
        req.body.last_name,
        req.body.dob,
        req.body.street_address,
        req.body.city,
        req.body.state_province,
        req.body.phone,
        req.body.email
      ]
    };
    pool.query(query, (err, result) => {
      if (err) {
        console.log(err);
      }
      // TODO - Better error handling
      if (!err) {
        res.send(result);
      }
    });
  },
  getPerson: (req, res) => {
    const query = {
      name: 'get-person',
      text: 'SELECT * \
             FROM person \
             WHERE email = ($1);',
      values: [req.query.email]
    };

    pool.query(query, (err, result) => {
      if (err) {
        console.log(err);
        // res.send(err);
      }
      // TODO - Better error handling
      if (!err) {
        res.send(result);
      }
    });
  },
  updateAvatar: (req, res) => {
    console.log(req.body);
    res.send();
  }
};
