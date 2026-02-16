const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    useremail:{
       type: String,
       required: true,
       unique: true
    },
    userpassword:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now 
    }
});

const User = mongoose.model('user', UserSchema);
module.exports = User;