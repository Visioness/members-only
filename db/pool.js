const { Pool } = require('pg');

const poolConfig = {};

const { USER, PASSWORD, HOST, DB_PORT, DB } = process.env;
poolConfig.connectionString = `postgresql://${USER}:${PASSWORD}@${HOST}:${DB_PORT}/${DB}`;

if (process.env.NODE_ENV === 'Production') {
  poolConfig.ssl = { require: true };
}

const pool = new Pool(poolConfig);

module.exports = pool;
