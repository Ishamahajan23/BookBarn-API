const mongoose = require("mongoose");
require("dotenv").config();
const connectDB= async ()=>{
    try{
        await mongoose.connect(process.env.MONGOOSE_KEY)
        console.log("Connected to DB")
    }catch(err){
        console.log("Not connected with DB")
    }
}
module.exports = connectDB