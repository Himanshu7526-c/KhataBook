const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'], 
        trim: true, 
        minlength: 3,
        maxlength: 50 
    },
    username: {
        type: String,
        required: [true, 'username is required'],
        trim: true, 
        minlength: 3,
        maxlength: 50 
    },
    profilepicture:{
        type:String,
        trim:true,
    },
    email: {
        type: String,
        required: true, 
        trim: [true,'email is required'], 
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        select: false,        
    },
    hisaab: [{ type: mongoose.Schema.Types.ObjectId, ref: "hisaab" }],
}, { timestamps: true });

module.exports = mongoose.model("user", userSchema);
