import mysql from 'mysql2/promise'
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()

const db = mysql.createPool({
  host: config.mysqlHost,
  user: config.mysqlUser,
  password: config.mysqlPassword,
  database: config.mysqlDatabase,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export default db
