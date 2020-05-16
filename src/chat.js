/* eslint-disable no-multi-str */
const pool = require('../db');
const io = require('./websocket');

module.exports = {
  addChat: async (req, res) => {
    let startChatValues;
    if (typeof req === 'number') {
      startChatValues = [req, '[]'];
    } else {
      startChatValues = [req.query.id, '[]'];
    }
    const startChatQuery = {
      name: 'add-new-chat',
      text:
        'INSERT INTO chats\
        (friendship_id, messages)\
        VALUES ($1, $2)\
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
  },
  updateChat: async (req, res) => {
    const { friendship, messages } = req.body;
    // eslint-disable-next-line no-unused-vars
    const updateChatQuery = {
      name: 'update-chat',
      text:
        'UPDATE chats \
        SET (messages) = row($2) \
        WHERE friendship_id = ($1) \
        RETURNING messages',
      values: [friendship, messages]
    };
    try {
      const updateChatResult = await pool.query(updateChatQuery);
      const updatedMessages = updateChatResult.rows[0];
      io.emit(`message${friendship}`, updatedMessages);
      res.status(200).send();
    } catch (error) {
      console.log(error);
    }
  }
};
