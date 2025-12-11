require('dotenv').config();
const { Client } = require('pg');

const SQL = `
  CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR ( 255 ) NOT NULL,
    last_name VARCHAR ( 255 ) NOT NULL,
    username VARCHAR ( 255 ),
    password VARCHAR ( 255 ) NOT NULL,
    has_membership BOOLEAN NOT NULL,
    is_admin BOOLEAN NOT NULL
  );

  CREATE TABLE messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR ( 255 ) NOT NULL,
    text TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL
  );
`;

async function main() {
  console.log('Seeding...');
  const clientConfig = {};

  const { USER, PASSWORD, HOST, DB_PORT, DB, DB_CONNECTION_STRING } =
    process.env;

  clientConfig.connectionString =
    DB_CONNECTION_STRING ||
    `postgresql://${USER}:${PASSWORD}@${HOST}:${DB_PORT}/${DB}`;

  if (process.env.NODE_ENV === 'production') {
    clientConfig.ssl = { require: true };
  }

  const client = new Client(clientConfig);

  try {
    await client.connect();
    await client.query(SQL);
    console.log('Done.');
  } catch (error) {
    console.log('Error while seeding the database: ', error);
  } finally {
    await client.end();
  }
}

main();
