const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    
 {
    prenom : {
        type : String,
        required : true
    },
    nom : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true 
    },
    password : {
        type : String,
        required : true
       
    },
    photo : {
        type : String,
        default : ''
    }
 },

 {timestamps: true }

);

module.exports = mongoose.model('User' , userSchema);