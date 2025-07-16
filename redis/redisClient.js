const redis = require("redis");
const redisClient= redis.createClient();
redisClient.connect();

redisClient.on("err", (err)=>{
    console.log("redis error",err);
})

module.exports = redisClient;