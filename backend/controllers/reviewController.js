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