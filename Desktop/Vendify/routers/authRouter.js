const express = require('express')
const { resetPassword, SignIn, resetPasswordRequest, validatePassword } = require('../controllers/authController')

const authRouter = express.Router()

authRouter
    // User SignIn
    .post('/user/SignIn', SignIn)
    // Password reset
    .post('/password/resetRequest', resetPasswordRequest)
    .post('/password/validate', validatePassword)
    .post('/password/reset', resetPassword)


module.exports = authRouter