const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{type:String},
    email:{type:String, required: true},
    password:{type:String, required: true, unique:true},
    role:{type:String, default:"viewer", eum:["viewer, admin, editor"]}
})

const userModel = mongoose.model("User", userSchema);
module.exports = userModel