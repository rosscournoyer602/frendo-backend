/* eslint-disable no-multi-str */
const AWS = require('aws-sdk');
const pool = require('../db');

AWS.config.update({
  secretAccessKey: process.env.S3KEY,
  accessKeyId: process.env.S3KEYID,
  region: 'ap-northeast-1'
});

const s3 = new AWS.S3();

module.exports = {
  addPerson: async (req, res) => {
    const query = {
      name: 'add-person',
      text:
        'INSERT INTO person\
            (first_name, last_name, street_address, city, state_province, phone, email)\
            VALUES ($1, $2, $3, $4, $5, $6, $7)\
            RETURNING first_name, last_name, street_address, city, state_province, phone, email, avatar_url',
      values: [
        req.body.first_name,
        req.body.last_name,
        req.body.street_address,
        req.body.city,
        req.body.state_province,
        req.body.phone,
        req.body.email
      ]
    };
    try {
      const addPersonResult = await pool.query(query);
      res.send(addPersonResult);
    } catch (err) {
      if (err.code === '23505') {
        try {
          const updateQuery = {
            name: 'update-person',
            text:
              'UPDATE person\
              SET (first_name, last_name, street_address, city, state_province, phone) = ($1, $2, $3, $4, $5, $6)\
              WHERE email = ($7)\
              RETURNING first_name, last_name, street_address, city, state_province, phone, email, avatar_url',
            values: [
              req.body.first_name,
              req.body.last_name,
              req.body.street_address,
              req.body.city,
              req.body.state_province,
              req.body.phone,
              req.body.email
            ]
          };
          const updateQueryResult = await pool.query(updateQuery);
          res.send(updateQueryResult);
        } catch (updateErr) {
          res.send(updateErr);
        }
      } else {
        res.send(err);
      }
    }
  },
  getPerson: async (req, res) => {
    const query = {
      name: 'get-person',
      text: 'SELECT * \
             FROM person \
             WHERE email = ($1);',
      values: [req.query.email]
    };
    try {
      const getPersonResult = await pool.query(query);
      res.send(getPersonResult);
    } catch (err) {
      res.send(err);
    }
  },
  findPerson: async (req, res) => {
    const query = {
      name: 'get-person',
      text:
        'SELECT * \
        FROM person \
        WHERE first_name ILIKE ($1) OR last_name ILIKE ($1) OR email ILIKE ($1)',
      values: [`%${req.query.search}%`]
    };
    try {
      const findPersonResult = await pool.query(query);
      res.send(findPersonResult);
    } catch (err) {
      res.send(err);
    }
  },
  updateAvatar: async (req, res) => {
    const type = req.body.data.split(';')[0].split('/')[1];
    const buffer = Buffer.from(req.body.data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const params = {
      Bucket: 'friendo2',
      Key: `${req.body.user}${Date.now()}.${type}`,
      Body: buffer,
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentType: `image/${type}`
    };
    const deleteParams = {
      Bucket: 'friendo2',
      Delete: {
        Objects: [
          {
            Key: `200x200/${req.body.currentAvatar}`
          },
          {
            Key: `64x64/${req.body.currentAvatar}`
          },
          {
            Key: `32x32/${req.body.currentAvatar}`
          }
        ]
      }
    };
    try {
      const deleteObjectsRequest = s3.deleteObjects(deleteParams);
      deleteObjectsRequest.promise();
    } catch (err) {
      res.send(err);
    }
    try {
      const uploadRequest = s3.upload(params);
      const uploadResult = await uploadRequest.promise();
      const updateQuery = {
        name: 'update-avatar',
        text: `UPDATE person\
          SET avatar_url = ($1)\
          WHERE email = ($2)`,
        values: [uploadResult.key, req.body.user]
      };
      const queryResult = await pool.query(updateQuery);
      if (queryResult.rowCount >= 1) {
        res.send(queryResult);
      }
      if (queryResult.rowCount === 0) {
        const addPersonQuery = {
          name: 'add-person',
          text:
            'INSERT INTO person\
                (email, avatar_url)\
                VALUES ($1, $2)\
                RETURNING first_name, last_name, street_address, city, state_province, phone, avatar_url, email',
          values: [req.body.user, uploadResult.key]
        };
        try {
          const addPersonQueryResult = await pool.query(addPersonQuery);
          res.send(addPersonQueryResult);
        } catch (err) {
          res.send(err);
        }
      }
    } catch (err) {
      res.send(err);
    }
  }
};
