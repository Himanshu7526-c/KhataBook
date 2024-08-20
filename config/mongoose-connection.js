const mongoose = require("mongoose")
mongoose.connect(process.env.MONGO_DB_URI).then(function(){
    console.log("connected to database")
})
module.exports=mongoose.Connection;