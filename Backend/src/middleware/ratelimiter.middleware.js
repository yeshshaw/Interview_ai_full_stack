const { redisClient } = require("../config/redis");

 const reteLimiter = async(req , res , next) =>{
try{
  
const key = `rate:${req.ip}:${req.path}` ;
const limit = 100 ; // request
const window = 60 ; // 60sec
const current = await redisClient.incr(key) ;

if(current ===1 ) {
  await redisClient.expire(key , window) ;
}
 
if (current > limit ) {
  return res.status(429).json({error : "Too many request"})
}
next()
}
catch(err){
  console.log(err);

        return res.status(500).json({

            error: "Internal server error"

        });
}
};

module.exports = {reteLimiter}