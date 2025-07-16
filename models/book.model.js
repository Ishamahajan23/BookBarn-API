const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    bookname:{type: String},
    authorId :{type: mongoose.Schema.Types.ObjectId, ref: "Author", required:true},
    bookyear:{type:Number},
    genre:{type:String},
    price:{type:Number}

})

const bookModel = mongoose.model("Book", bookSchema);
module.exports = bookModel