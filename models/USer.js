const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    // updatedAt:{
    //     type: new Date()
    // }
});
const User = mongoose.model('user',userSchema)
module.exports = User