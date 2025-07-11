import 'dotenv/config'
import mysql from 'mysql2/promise'

export const dbEditais = mysql.createPool({
  host: process.env.DB_EDITAIS_HOST,
  user: process.env.DB_EDITAIS_USER,
  password: process.env.DB_EDITAIS_PASSWORD,
  database: process.env.DB_EDITAIS_DATABASE,
})
