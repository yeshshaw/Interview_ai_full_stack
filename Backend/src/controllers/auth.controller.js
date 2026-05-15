const userModel = require("../model/user.model") ;
const bcrypt = require("bcryptjs") ; 
const jwt = require("jsonwebtoken") ;
const {redisClient} = require('../config/redis');
const emailService = require('../service/email.services')


/** 
 * @name registerUserController
 * @route POST /api/auth/register
 * @description register new user, expect username , email , password in the reques t body 
 * @access public 
 */
async function registerUserController (req , res ) {
  const {userName , email , password } = req.body ;
  if (!userName || !email || !password) {
    return res.status(400).json({
      message : "please provide userName , email , password "
    })
  }

  const isuserAlreadyExist = await userModel.findOne({
    $or :[{userName},{email}]
  })
  if (isuserAlreadyExist) {
    return res.status(400).json({
      message : "account already exist with this email address or userName "
    })
  }

  const hash = await bcrypt.hash(password , 10 ) 
  const user = await userModel.create({
    userName , 
    email ,
    password : hash
  })

  const token = jwt.sign({userName , id : user._id} , process.env.JWT_SECRET , {expiresIn : "1d"})

  res.cookie("token", token, {

  httpOnly: true,

  secure: true,

  sameSite: "None",

  maxAge: 24 * 60 * 60 * 1000

})


    // Send welcome email

    await emailService.sendRegisterEmail(email, userName);
  res.status(201).json({
    message : "User Register succesfully " ,
    user : {
      id : user._id ,
      userName : user.userName ,
      email : user.email
    }
  })
 
}
async function loginUserController(req , res) {
  const {email , password} = req.body ;
  const user = await userModel.findOne({email}).select('+password') ;
  if (!user) {
    return res.status(400).json({
      message : "Invalid email and password"
    })
  }

  const isPasswordValid = await bcrypt.compare(password , user.password)  ;
  if(!isPasswordValid) {
    return res.status(400).json({
      message : "Invalid user , password"
    })
  }
  const token = jwt.sign({userName : user.userName , id : user._id} , process.env.JWT_SECRET , {expiresIn : "1d"})

  res.cookie("token", token, {

  httpOnly: true,

  secure: true,

  sameSite: "None",

  maxAge: 24 * 60 * 60 * 1000

})

  res.status(201).json({
    message : "User Register succesfully " ,
    user : {
      id : user._id ,
      userName : user.userName ,
      email : user.email
    }
  })

}
async function logoutUserController(req , res) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1] ;
  const decoded = jwt.decode(token) ;
  const expiryTime = decoded.exp - Math.floor(Date.now() / 1000 ) ;
  //redis me store 
  await redisClient.set (
    token ,
    "Blacklisted" ,
    {
       EX: expiryTime
    }
  );
  res.clearCookie("token", {

  httpOnly: true,

  secure: true,

  sameSite: "None"

})
   res.json({
        message: "Logged out"
    });

}

async function getMeController(req , res) { 
  const user  = await userModel.findById(req.user.id) ;
  res.status(200).json({
    user: {
      id : user._id ,
      userName : user.userName ,
      email : user.email
    }
  })
}



module.exports = {registerUserController , loginUserController , logoutUserController , getMeController} ;