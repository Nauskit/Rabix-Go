const { pool } = require('../config/db')


exports.createPlace = async (req, res) => {
    try {
        const { name, place_type, description, address, province, district, subdistrict, latitude, longitude } = req.body;
        const userId = req.user.id;


        if (!name || !place_type || !address || !province || !district || !subdistrict) {
            return res.status(400).json({
                message: 'All field are required'
            })
        }
        if (latitude === undefined || latitude === null || longitude === undefined || longitude === null) {
            return res.status(400).json({
                message: 'Location are required'
            })
        }

        const normalizedName = name.toLowerCase().trim();

        const nameExist = await pool.query(
            "SELECT name FROM places WHERE name = $1", [normalizedName]
        )
        if (nameExist.rows.length > 0) {
            return res.status(400).json({
                message: 'name already used'
            })
        }

        const newPlace = await pool.query(
            "INSERT INTO places (name, place_type, description, address, province, district, subdistrict, latitude, longitude, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, $10) RETURNING *",
            [normalizedName, place_type, description, address, province, district, subdistrict, latitude, longitude, userId]
        )

        return res.status(201).json({
            message: 'Restaurant created successfully',
            restaurant: newPlace.rows[0]
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getPlaces = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const getLimit = await pool.query(
            `SELECT p.*, COALESCE(JSON_AGG(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL),'[]') AS images
            FROM places p
            LEFT JOIN place_images pi on pi.place_id = p.id
            GROUP BY p.id
            ORDER BY p.created_at DESC
            LIMIT $1 OFFSET $2`,
            [limit, offset]
        )

        return res.status(200).json({
            message: "Get restaurants Done",
            page,
            limit,
            data: getLimit.rows
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getPlaceById = async (req, res) => {
    try {
        const { id } = req.params;
        const getPlaceId = await pool.query(
            `SELECT 
                p.*,
                COALESCE(
                    JSON_AGG(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL),
                    '[]'
                ) AS images
             FROM places p
             LEFT JOIN place_images pi ON pi.place_id = p.id
             WHERE p.id = $1
             GROUP BY p.id`, [id]
        )
        if (getPlaceId.rows.length === 0) {
            return res.status(400).json({
                message: 'Place not found'
            })
        }
        return res.status(200).json({
            data: getPlaceId.rows[0]
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
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
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

//Add image
exports.addPlaceImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { image_url } = req.body;


        console.log('id:', id);
        console.log('url:', image_url);


        const addImage = await pool.query(
            "INSERT INTO places_images (place_id, image_url) VALUES ($1, $2) RETURNING *",
            [id, image_url]
        )

        return res.status(200).json({
            data: addImage.rows[0]
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}