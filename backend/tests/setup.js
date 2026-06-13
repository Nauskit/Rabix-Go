process.env.NODE_ENV = "test";
const { pool } = require("../config/db")


beforeEach(async () => {
    await pool.query(
        "DELETE FROM users"
    )
})