const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT),
    ssl: false,

})

const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('PostgreSQL Connected!');
        client.release()
    } catch (err) {
        console.log("Error: ", err.message);
    }
}

module.exports = { pool, connectDB };