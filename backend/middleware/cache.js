const redis = require('../lib/redis');

const cache = (ttl = 60) => async (req, res, next) => {
    const key = `cache:${req.originalUrl}`

    try {
        const cached = await redis.get(key)
        if (cached) {
            return res.json(JSON.parse(cached))
        }
    } catch (err) {
        console.error('Redis error: ', err);
    }

    const originalJson = res.json.bind(res)
    res.json = (body) => {
        if (res.statusCode === 200) {
            redis.setex(key, ttl, JSON.stringify(body)).catch(() => { })
        }
        return originalJson(body)
    }

    next()
}


const invalidateCache = async (pattern) => {
    try {
        const keys = await redis.keys(`Cache:${pattern}`)
        if (keys.length > 0) await redis.del(...keys);
    } catch (err) {
        console.error('Redis invalidate error: ', err)
    }
}

module.exports = { cache, invalidateCache }