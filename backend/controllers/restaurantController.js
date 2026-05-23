const { pool } = require('../config/db')


exports.createRestaurant = async (req, res) => {
    try {
        const { name, description, address } = req.body;
        const userId = req.user.id;


        if (!name || !address) {
            return res.status(400).json({
                message: 'name or address are require'
            })
        }

        name = name.toLowerCase().trim();

        const nameExist = await pool.query(
            "SELECT name FROM restaurants WHERE name = $1", [name]
        )
        if (nameExist.rows.length > 0) {
            return res.status(400).json({
                message: 'name already used'
            })
        }

        const newRestaurant = await pool.query(
            "INSERT INTO restaurants (user_id, name,description,address) VALUES ($1,$2,$3,$4) RETURNING *",
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

exports.getRestaurants = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const getLimit = await pool.query(
            "SELECT * FROM restaurants LIMIT $1 OFFSET $2",
            [limit, offset]
        )

        return res.status(200).json({
            message: "Get restaurants Done",
            page,
            limit,
            data: getLimit.rows
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server Error",
            error: err.message
        })
    }
}

exports.filterRestaurants = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const address = (req.query.address);

        if (!address) {
            return res.status(400).json({
                message: "address is required"
            })
        }


        const filterRestaurants = await pool.query(
            "SELECT * FROM restaurants WHERE address ILIKE $1 LIMIT $2 OFFSET $3",
            [`%${address}%`, limit, offset]
        )

        return res.status(200).json({
            message: `Get filter ${address} successfully`,
            data: filterRestaurants.rows
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server Error",
            error: err.message
        })
    }
}