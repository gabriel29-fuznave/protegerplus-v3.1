const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'sistema_proteger',
  password: process.env.DB_PASSWORD || 'your_password',
  port: 5432,
});
module.exports = pool;
