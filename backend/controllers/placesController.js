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
            `SELECT p.*,
            COALESCE(
                JSON_AGG(DISTINCT pi.image_url) FILTER (WHERE pi.image_url is NOT NULL),
                '[]'
                ) AS images,
                 COALESCE(
                 (
                    SELECT JSON_AGG(tag_summary.name)
                    FROM (
                        SELECT t.name, COUNT(*) AS vote_count
                        FROM review_tags rt
                        JOIN reviews r ON r.id = rt.review_id
                        JOIN tags t ON t.id = rt.tag_id
                        WHERE r.place_id = p.id
                        GROUP BY t.id, t.name
                        ORDER BY vote_count DESC
                        LIMIT 5
                    ) AS tag_summary
                 ),
                 '[]'
                ) AS top_tags,
                COUNT(DISTINCT r.id) AS review_count,
                ROUND(AVG(r.rating), 1) AS avg_rating
            FROM places p
            LEFT JOIN place_images pi ON pi.place_id = p.id
            LEFT JOIN reviews r ON r.place_id = p.id
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
                    JSON_AGG(DISTINCT pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL),
                    '[]'
                )AS images,
                COALESCE (
                    (
                        SELECT JSON_AGG(tag_summary.name)
                        FROM(
                            SELECT t.name, COUNT(*) AS vote_count
                            FROM review_tags rt
                            JOIN reviews r ON r.id = rt.review_id
                            JOIN tags t ON t.id = rt.tag_id
                            WHERE r.place_id = p.id
                            GROUP BY t.id, t.name
                            ORDER BY vote_count DESC
                            LIMIT 5
                        )AS tag_summary
                    ),
                '[]'
                )AS top_tags,
                COUNT(DISTINCT r.id) AS review_count,
                ROUND(AVG(r.rating), 1) AS avg_rating,
                COALESCE(
                    (
                        SELECT JSON_AGG(review_summary)
                        FROM (
                            SELECT
                                r2.id,
                                r2.comment,
                                r2.rating,
                                r2.created_at,
                                u.username,
                                COALESCE(
                                    (
                                        SELECT JSON_AGG(t.name)
                                        FROM review_tags rt
                                        JOIN tags t ON t.id = rt.tag_id
                                        WHERE rt.review_id = r2.id
                                    ),
                                    '[]'
                                )AS tags
                            FROM reviews r2
                            JOIN users u ON u.id = r2.user_id
                            WHERE r2.place_id = p.id
                            ORDER BY r2.created_at DESC
                            LIMIT 5
                        ) AS review_summary
                    ),
                    '[]'
                ) AS reviews
            FROM places p
            LEFT JOIN place_images pi ON pi.place_id = p.id
            LEFT JOIN reviews r ON r.place_id = p.id
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