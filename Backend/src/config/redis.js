const redis = require("redis");

const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    socket: {
        tls: true,
        rejectUnauthorized: false
    }
});

async function connectRedis() {
    try {
        await redisClient.connect();
        console.log("Redis connected");
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    redisClient,
    connectRedis
};