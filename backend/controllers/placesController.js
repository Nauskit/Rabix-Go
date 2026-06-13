const { pool } = require('../config/db')
const { invalidateCache } = require('../middleware/cache')

exports.createPlace = async (req, res) => {
    const { name, place_type, description, address, province, district, subdistrict, price_min, price_max, image_url } = req.body;
    const userId = req.user.id;

    if (!name || !place_type || !address || !province || !district || !subdistrict) {
        return res.status(400).json({
            message: "All field are required"
        })
    }

    const normalizedName = name.trim();
    const normalizedDescription = description?.trim() || null;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const nameExist = await client.query(
            `SELECT name FROM places WHERE name = $1`, [normalizedName]
        )
        if (nameExist.rowCount > 0) {
            await client.query('ROLLBACK')
            return res.status(400).json({
                message: 'Name already used'
            })
        }

        const place = await client.query(
            `INSERT INTO places (name,place_type,description,address,province, district,subdistrict, created_by, price_min, price_max)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, $10) RETURNING *`,
            [normalizedName, place_type, normalizedDescription, address, province, district, subdistrict, userId, price_min, price_max]
        )

        const placeId = place.rows[0].id

        if (image_url) {
            await client.query(
                `INSERT INTO place_images (place_id, image_url)
                VALUES ($1,$2)`,
                [placeId, image_url]
            );
        }

        await client.query('COMMIT');
        await invalidateCache('/places');
        return res.status(201).json({
            data: place.rows[0],
            message: 'Restaurant created successfully'
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release();
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




        const addImage = await pool.query(
            "INSERT INTO place_images (place_id, image_url) VALUES ($1, $2) RETURNING *",
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


exports.deletePlace = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deletePlace = await pool.query(
            `DELETE FROM places WHERE id = $1 AND created_by = $2 RETURNING *`,
            [id, userId]
        )
        if (deletePlace.rows.length === 0) {
            return res.status(404).json({
                message: 'Place not found or permission denied'
            })
        }

        return res.status(200).json({
            message: 'Place has deleted'
        })


    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
}