const { Pool } = require('pg');

const poolConfig = {};

const { USER, PASSWORD, HOST, DB_PORT, DB, DB_CONNECTION_STRING } = process.env;
poolConfig.connectionString =
  DB_CONNECTION_STRING ||
  `postgresql://${USER}:${PASSWORD}@${HOST}:${DB_PORT}/${DB}`;

if (process.env.NODE_ENV === 'production') {
  poolConfig.ssl = { require: true };
}

const pool = new Pool(poolConfig);

module.exports = pool;
