import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.RDS_USERNAME,
  host: process.env.RDS_HOSTNAME,
  database: process.env.RDS_DB_NAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
})

const query = (statement, params, callback) => pool.query(statement, params, callback)

export { query }
export default pool
