const pool = require('./pool');

const getAllMessages = async () => {
  const { rows } = await pool.query(
    'SELECT title, text, timestamp, username AS author FROM messages JOIN users ON users.id = author_id'
  );
  return rows;
};

const getUserByUsername = async (username) => {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE username = $1;',
    [username]
  );
  return rows[0];
};

const addMembership = async (userId) => {
  await pool.query('UPDATE users SET has_membership = $1 WHERE id = $2;', [
    true,
    userId,
  ]);
};

const createUser = async (
  firstName,
  lastName,
  username,
  password,
  hasMembership
) => {
  await pool.query(
    'INSERT INTO users (first_name, last_name, username, password, has_membership) VALUES ($1, $2, $3, $4, $5);',
    [firstName, lastName, username, password, hasMembership]
  );
};

const createMessage = async (authorId, title, text) => {
  await pool.query(
    'INSERT INTO messages (author_id, title, text, timestamp) VALUES ($1, $2, $3, NOW());',
    [authorId, title, text]
  );
};

module.exports = {
  getAllMessages,
  getUserByUsername,
  addMembership,
  createUser,
  createMessage,
};
