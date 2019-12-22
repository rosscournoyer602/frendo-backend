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
      const firstMessage = "You've added a new friend. Start chatting";
      const firstMessageValues = [addNewChatResult.rows[0].chat_id, firstMessage];
      const firstMessageQuery = {
        name: 'add-first-message',
        text: 'INSERT INTO messages\
        (chat_id, content)\
        VALUES ($1, $2)',
        values: firstMessageValues
      };
      try {
        pool.query(firstMessageQuery);
      } catch (err) {
        console.log(err);
      }
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
      const getMessagesQuery = {
        name: 'get-messages',
        text: 'SELECT * FROM messages\
        WHERE chat_id = ($1)',
        values: [getChatResult.rows[0].chat_id]
      };
      try {
        const getMessagesResult = await pool.query(getMessagesQuery);
        res.send(getMessagesResult);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  }
};
