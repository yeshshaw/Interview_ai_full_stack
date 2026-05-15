const mongoose = require("mongoose") ;

const userSchema = new mongoose.Schema({
  userName : {
    type : String ,
    unique : true  ,
    required : true
  },
   email: {
      type: String,
      required: [true, 'Email is required for creating a user '],
      trim: true,
      lowercase: true,
      validate : {
        validator : (value)=> {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
        } , 
        message : 'Invalid Email address',
      },
      unique: true,
    },
  password: {

  type: String,

  required: [true, 'Password is required'],
  select: false,

}
})

const userModel = mongoose.model("users" , userSchema) ;

module.exports = userModel ;