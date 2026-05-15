const jwt = require('jsonwebtoken') ;
const {redisClient} = require('../config/redis') ;
const userModel = require('../model/user.model')

async function authMiddleware(req , res ,next) {

  const token = req.headers.authorization?.split(" ")[1]|| req.cookies?.token ;
  if (!token) {
    return res.status(401).json({
      message : "Unauthorized: No token"
    })
  };
  //check blacklisted
  const isBlacklisted = await redisClient.get(token) ;
  if (isBlacklisted) {
    return res.status(401).json({
         message: "Token expired/logout"
    })
  };
  try{
    const decoded = jwt.verify(token , process.env.JWT_SECRET) ;
     const user = await userModel.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(401).json({
        message: 'User not found',
      });
    }
     req.user = user;
     req.token = token
     next();
  }
  catch (err) {
      console.log(err)
        return res.status(401).json({

            message: "Invalid token"

        });

    }
};

module.exports = {authMiddleware}
