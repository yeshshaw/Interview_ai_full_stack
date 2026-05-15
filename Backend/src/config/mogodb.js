const mongoose = require("mongoose") ;

async function connectToDb() {
 try{ await mongoose.connect(process.env.MONGO_URI)
  console.log("connect to Database")
}
  catch(err) {
    console.log(err)
  }
}


module.exports = connectToDb