const { pool } = require('../config/db')

exports.createReview = async (req, res) => {
    const { id } = req.params;
    const { placeId } = req.params;
    const comment = await pool.query(
        `INSERT INTRO review_place ()`
    )
}

exports.getTags = async (req, res) => {
    try {
        const getAllTags = await pool.query(
            `SELECT id,name FROM tags`
        )
        return res.status(200).json({
            data: getAllTags.rows
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.sendReview = async (req, res) => {
    try {
        const { placeId } = req.params;
        const userId = req.user.id;
        const { comment, rating } = req.body;
        if (!userId || !placeId) {
            return res.status(400).json({
                message: 'invalid id'
            })
        }
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            })
        }
        const checkComment = comment || null;
        const existUserReview = await pool.query(
            `SELECT id FROM reviews WHERE user_id = $1 AND place_id =$2`,
            [userId, placeId]
        )
        if (existUserReview.rowsCount > 0) {
            return res.status(409).json({
                message: "You have already reviewed this place"
            })
        }

        const result = await pool.query(
            `INSERT INTO reviews (user_id, place_id, comment, rating) VALUES ($1,$2,$3,$4) RETURNING *`
            , [userId, placeId, checkComment, rating]
        )

        return res.status(201).json({
            data: result.rows[0]
        })


    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


exports.updateReview = async (req, res) => {
    try {
        const { placeId } = req.params;
        const userId = req.user.id;
        const { comment, rating } = req.body;
        if (!userId || !placeId) {
            return res.status(400).json({
                message: 'invalid id'
            })
        }
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            })
        }
        const checkComment = comment.trim() || null;
        const checkUser = await pool.query(
            `SELECT id FROM reviews WHERE user_id = $1 AND place_id = $2`,
            [userId, placeId]
        )
        if (checkUser.rowCount === 0) {
            return res.status(404).json({
                message: 'Review not found'
            })
        }

        const result = await pool.query(
            `UPDATE reviews SET comment = $1, rating = $2, updated_at = NOW() WHERE user_id = $3 AND place_id = $4 RETURNING *`,
            [userId, placeId, checkComment, rating]
        )
        return res.status(200).json({
            data: result.rows[0]
        })


    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}