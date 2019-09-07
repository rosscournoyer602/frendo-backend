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
  addPerson: (req, res) => {
    const query = {
      name: 'add-person',
      text:
        'INSERT INTO person\
            (first_name, last_name, street_address, city, state_province, phone, email)\
            VALUES ($1, $2, $3, $4, $5, $6, $7)\
            RETURNING first_name, last_name, street_address, city, state_province, phone, email',
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
    pool.query(query, (err, result) => {
      if (err) console.log(err);
      if (err && err.code === '23505') {
        const updateQuery = {
          name: 'update-person',
          text:
            'UPDATE person\
            SET (first_name, last_name, street_address, city, state_province, phone) = ($1, $2, $3, $4, $5, $6)\
            WHERE email = ($7)\
            RETURNING first_name, last_name, street_address, city, state_province, phone, avatar_url, email',
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
        pool.query(updateQuery, (updateErr, updateResult) => {
          if (updateErr) {
            console.log(updateErr);
          }
          if (!updateErr) {
            res.send(updateResult);
          }
        });
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
  findPerson: (req, res) => {
    console.log('FIND', req.query.search);
    const query = {
      name: 'get-person',
      text:
        'SELECT * \
        FROM   person \
        WHERE  first_name ILIKE ($1) OR last_name ILIKE ($1) OR phone ILIKE ($1) OR email ILIKE ($1)',
      values: [req.query.search]
    };

    pool.query(query, (err, result) => {
      if (err) {
        console.log(err);
        // res.send(err);
      }
      // TODO - Better error handling
      if (!err) {
        console.log('SEARCH RESULT', result.rows);
        res.send(result);
      }
    });
  },
  updateAvatar: async (req, res) => {
    const type = req.body.data.split(';')[0].split('/')[1];
    const buffer = Buffer.from(req.body.data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const params = {
      Bucket: 'friendo2',
      Key: `${req.body.user}.${type}`,
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
            Key: `200x200/${req.body.user}.${type}`
          },
          {
            Key: `64x64/${req.body.user}.${type}`
          }
        ]
      }
    };
    const deleteObjectsRequest = s3.deleteObjects(deleteParams);
    try {
      deleteObjectsRequest.promise();
    } catch (err) {
      res.send(err);
    }
    const uploadRequest = s3.upload(params);
    try {
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
                RETURNING first_name, last_name, dob, street_address, city, state_province, phone, avatar_url, email',
          values: [req.body.user, uploadResult.key]
        };
        try {
          const addPersonQueryResult = await pool.query(addPersonQuery);
          res.send(addPersonQueryResult);
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
    }
    // s3.upload(params, (err, data) => {
    //   if (err) {
    //     res.send(err);
    //   }
    //   if (!err) {
    //     // res.send(data);
    //     const updateQuery = {
    //       name: 'update-avatar',
    //       text: `UPDATE person\
    //         SET avatar_url = ($1)\
    //         WHERE email = ($2)`,
    //       values: [data.key, req.body.user]
    //     };
    //     pool.query(updateQuery, (updateErr, result) => {
    //       if (updateErr) {
    //         console.log(updateErr);
    //       }
    //       if (!err) {
    //         res.send(result);
    //       }
    //     });
    //   }
    // });
  }
};
