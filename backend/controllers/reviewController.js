const { pool } = require('../config/db')


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


    const { placeId } = req.params;
    const userId = req.user.id;
    const { comment, rating, tags } = req.body;

    if (!placeId) {
        return res.status(400).json({
            message: 'Invalid id'
        })
    }
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
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const checkComment = comment || null;
        const existUserReview = await client.query(
            `SELECT id FROM reviews WHERE user_id = $1 AND place_id =$2`,
            [userId, placeId]
        )
        if (existUserReview.rowCount > 0) {
            return res.status(409).json({
                message: "You have already reviewed this place"
            })
        }

        const result = await client.query(
            `INSERT INTO reviews (user_id, place_id, comment, rating) VALUES ($1,$2,$3,$4) RETURNING *`
            , [userId, placeId, checkComment, rating]
        )

        const reviewId = result.rows[0].id;
        if (Array.isArray(tags) && tags.length > 0) {
            const validTags = tags.filter(tagId => tagId != null);
            for (const tagId of validTags) {
                await client.query(
                    `INSERT INTO review_tags (review_id, tag_id) VALUES ($1, $2)`,
                    [reviewId, tagId]
                )
            }
        }
        await client.query('COMMIT');

        return res.status(201).json({
            data: result.rows[0]
        })


    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release();
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
            [checkComment, rating, userId, placeId]
        )
        return res.status(200).json({
            data: result.rows[0]
        })


    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}