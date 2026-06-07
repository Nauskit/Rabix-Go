const { pool } = require('../config/db')


exports.getUserRoute = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            'SELECT id,name,created_at FROM routes WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        )
        return res.status(200).json({
            message: "Get user route successfully",
            data: result.rows
        })


    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.addPlcaeToRoute = async (req, res) => {
    try {
        const { routeId } = req.params
        const { placeId } = req.body

        const lastIndex = await pool.query(
            `SELECT COALESCE (MAX(order_idex), 0) AS max_index
            FROM route_places WHERE route_id = $1`, [routeId]
        )
        const orderIndex = lastIndex.rows[0].max_index + 1;

        const result = await pool.query(
            `INSERT INTO route_places (route_id,place_id,order_index) VALUES
            ($1,$2,$3) RETURNING *`, [routeId, placeId, orderIndex]
        )
        return res.status(201).json({
            message: "create route successfully",
            data: result.rows
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.createRoute = async (req, res) => {
    try {
        const { name } = req.body
        const userId = req.user.id;

        if (!name.trim()) {
            return res.status(400).json({
                message: 'Route name is required'
            })
        }
        const result = await pool.query(
            'INSERT INTO routes (user_id,name) VALUES ($1,$2) RETURNING *',
            [userId, name]
        )

        return res.status(201).json({
            message: 'Route created successfully',
            data: result.rows[0]
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.removePlaceFromRoute = async (req, res) => {
    try {
        const { routeId, placeId } = req.params;
        await pool.query(
            `DELETE FROM route_places WHERE route_id = $1 AND place_id = $2`,
            [routeId, placeId]
        )

        return res.status(200).json({
            message: 'Removed successfully'
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.removeRoute = async (req, res) => {
    try {
        const { routeId } = req.params;
        await pool.query(
            `DELETE FROM routes WHERE id = $1`,
            [routeId]
        )

        return res.status(200).json({
            message: 'Removed successfully'
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


