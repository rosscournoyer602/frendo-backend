/* eslint-disable no-multi-str */
const pool = require('../db');
const chat = require('./chat');

module.exports = {
  updateFriends: async (req, res) => {
    const values = [];
    const { id1, id2, option, actionTaker } = req.body;
    if (id1 > id2) {
      values.push(id2);
      values.push(id1);
      values.push(option);
      values.push(actionTaker);
    } else {
      values.push(id1);
      values.push(id2);
      values.push(option);
      values.push(actionTaker);
    }
    const query = {
      name: 'update-friends',
      text:
        'INSERT INTO friendships\
        (person_one, person_two, friend_status, action_taker)\
        VALUES ($1, $2, $3, $4)\
        RETURNING (friendship_id)',
      values
    };
    try {
      const insertFriendsResult = await pool.query(query);
      res.send(insertFriendsResult);
    } catch (err) {
      if (err.code === '23505') {
        const updateQuery = {
          name: 'update-existing-friends',
          text:
            'UPDATE friendships\
             SET (friend_status, action_taker) = ($3, $4)\
             WHERE (person_one,person_two) = ($1, $2)\
             RETURNING friendship_id, friend_status',
          values
        };
        try {
          const updateFriendsResult = await pool.query(updateQuery);
          console.log('UFR', updateFriendsResult);
          if (updateFriendsResult.rows[0].friend_status === 2) {
            chat.addChat(updateFriendsResult.rows[0].friendship_id);
          }
          res.send(updateFriendsResult);
        } catch (updateErr) {
          res.send(updateErr);
        }
      } else {
        res.send(err);
      }
    }
  },
  getFriends: async (req, res) => {
    const { id } = req.query;
    const query = {
      name: 'get-friends',
      text:
        'SELECT * FROM friendships\
         INNER JOIN person ON person.person_id = friendships.person_one OR person.person_id = friendships.person_two\
         WHERE person.person_id != ($1) AND (friendships.person_one = ($1) OR friendships.person_two = ($1));',
      values: [id]
    };
    try {
      const getFriendsResult = await pool.query(query);
      res.send(getFriendsResult);
    } catch (err) {
      res.send(err);
    }
  }
};
