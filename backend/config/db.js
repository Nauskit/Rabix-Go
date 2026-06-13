const { Pool } = require('pg');
const dotenv = require("dotenv")

if (process.env.NODE_ENV === "test") {
    dotenv.config({ path: ".env.test" });
} else {
    dotenv.config();
}


const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST || 'db',
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
        console.error('Database connection filed:', err.message);
        process.exit(1);
    }
}



module.exports = { pool, connectDB };