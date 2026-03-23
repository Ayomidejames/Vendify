const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true },
    email: {
        type: String, 
        required: true, 
        unique: true },
    password: {
        type: String, 
        required: true
    },
    superAdmin: {
        type: Boolean,
        default: false
    },
    otp: String,
    otpInvalid: Date,
    passwordResetToken: String,
    passwordResetTokenInvalid: String,
    isVerified: {
        type: Boolean, default: false
    },
    isAdmin: {
        type: Boolean, 
        default: false,
    lastOPTsent: Date
    // Profile: { 
    //     country: String,
    //     Street: String,
    //     bio: String 
    // }
}},
// generates the time new user is created or the time an existing user was modified.
{timestamps: true})

const User = mongoose.model('User', userSchema)

module.exports = User