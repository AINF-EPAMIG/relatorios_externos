import mysql from 'mysql2/promise';

export const Contratos = mysql.createPool({
  host: process.env.DB_CONTRATOS_HOST,
  user: process.env.DB_CONTRATOS_USER,
  password: process.env.DB_CONTRATOS_PASSWORD,
  database: process.env.DB_CONTRATOS_DATABASE,
});
