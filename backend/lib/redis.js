const Redis = require('ioredis');

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    lazyConnect: true,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 0,
})

redis.on('connect', () => console.log('Redis connected'))
redis.on('error', (err) => console.log('Redis error:', err))

module.exports = redis