const { pool } = require('../config/db')


exports.createRestaurant = async (req, res) => {
    try {
        const { name, description, address } = req.body;
        const userId = req.params.id;

        if (!name || !address) {
            return res.status(400).json({
                message: 'name or address are require'
            })
        }

        const nameExist = await pool.query(
            "SELECT name FROM restaurants WHERE name = $1", [name]
        )
        if (nameExist.rows.length > 0) {
            return res.status(400).json({
                message: 'name already used'
            })
        }

        const newRestaurant = await pool.query(
            "INSERT INTO restaurants (user_id, name,description,address) VALUES ($1,$2,$3) RETURNING *",
            [userId, name, description, address]
        )

        return res.status(201).json({
            message: 'Restaurant created successfully',
            restaurant: newRestaurant.rows[0]
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server Error",
            error: err.message
        })
    }
}