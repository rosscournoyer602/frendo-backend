/* eslint-disable no-multi-str */
const pool = require('../db');

module.exports = {
  addChat: async (req, res) => {
    let startChatValues;
    if (typeof req === 'number') {
      startChatValues = [req];
    } else {
      startChatValues = [req.query.id];
    }
    const startChatQuery = {
      name: 'add-new-chat',
      text:
        'INSERT INTO chats\
        (friendship_id)\
        VALUES ($1)\
        RETURNING chat_id',
      values: startChatValues
    };
    try {
      const addNewChatResult = await pool.query(startChatQuery);
      res.send(addNewChatResult);
    } catch (err) {
      console.log(err);
    }
  },
  getChat: async (req, res) => {
    const friendshipId = [req.query.id];
    const getChatQuery = {
      name: 'get-chat',
      text: 'SELECT * FROM chats\
        WHERE friendship_id = ($1)',
      values: friendshipId
    };
    try {
      const getChatResult = await pool.query(getChatQuery);
      res.send(getChatResult);
    } catch (err) {
      console.log(err);
    }
  }
};
