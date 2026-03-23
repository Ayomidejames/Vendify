const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../schema/userSchema')
const { generateOTP } = require('../lib/mailService')

const SignIn = async(req, res) => {
    try {
        const {email, password} = req.body
        if (!email || !password) {
            return res.status(400).json({
                msg: "Please provide email and password to proceed."
            })
        }
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({
                msg: "User not found. Please proceed to register first."
            })
        }
        if (!user.isVerified){
            return res.status(403).json({msg: "User not verified."})
        }

            // comparing the password passed into the request body to the password of the user in the database
            const comparedPassword = await bcrypt.compare(password, user.password)
            if (comparedPassword === false) {
                return res.status(404).json({
                    msg: 'email or password incorrect. Try again'
                })
            }
            const getToken = (id) => {
                return jwt.sign(
                    {id},
                    process.env.JWT_SECRET,
                    {expiresIn: "30m"}
                )
            }
            const Token = getToken(user._id)
            return res
                .cookie('token', Token, {httpOnly: true, sameSite: 'strict'})
                .status(200)
                .json({msg: 'Log in successful.'})
        } catch (error) {
        res.status(500).json({
            msg: error.message
        })
    }
}

const resetPasswordRequest = async(req, res) => {
    const { email } = req.body
    try {
        const user = await User.finOne({email})
        if (!user) return res.status(404).json({msg: 'User with email not found. Proceed to register.'})
        const { passwordResetToken, otpInvalid } = generateOTP()
        user.passwordResetToken = passwordResetToken
        user.passwordResetTokenInavlid = otpInvalid
        await user.save()
        try {
            const mailObj = {
                mailFrom: `Kits Global ${process.env.kitmail}`,
                mailTo: email,
                subject: 'Kits Password Reset',
                body: `
                <h1>You have requested for a password reset<strong>${user.username}</strong></h1>
                <p>https://student.axia.africa/${passwordResetToken} forgot password</p>
                `
            }
        sendMail(mailObj)
        }
        catch (error) {console.log(error)}
        res.status(200).json({msg: 'Your account has been verified. Proceed to login.'})        
    } catch (error) {
        console.log(error)
    }
}

const validatePassword = async(req, res) => {
    const {token, email} = req.body
    try {
        const user = await User.finOne({email})
        if (!user) return res.status(404).json({msg: 'User with email not found. Proceed to register.'})
        if (user.passwordResetToken !== token && user.passwordResetTokenInavlid < Date.now()) return res.status(400).json({msg: 'Invalid token'})
        res.status(200).json({msg: 'Access granted, proceed to change password.'})
    } catch (error) {
        console.log(error)
    }
}

const resetPassword = async(req, res) => {
    const {token, newPassword} = req.body
    try {
        const user = await User.findOne({passwordResetToken: token})
        if (!user) return res.status(404).json({msg: 'User with email not found. Proceed to register.'})
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()
        res.status(200).json({msg: 'Password changed successfully.'})
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    SignIn,
    resetPasswordRequest,
    validatePassword,
    resetPassword
}