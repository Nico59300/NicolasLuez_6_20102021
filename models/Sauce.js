const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SauceSchema = new Schema({
    userId : {
        type: String,
        required: true,
    },
    name : {
        type: String,
        
    },
    manufacturer: {
        type: String
    },
    description : {
        type: String,
        
    },
    mainPepper : {
        type: String,
        
    },
    imageUrl : {
        type: String,
        
    },
    heat : {
        type: Number,
        
    },
    likes : {
        type: Number,
        
    },
    dislikes : {
        type: Number,
        
    },
    usersLiked : {
        type: Array,
        
    },
    usersDisliked : {
        type: Array,
        
    },
})

module.exports = Sauce = mongoose.model("Sauce", SauceSchema);