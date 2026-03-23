const User = require("../schema/userSchema")
const { sendMail, generateOTP } = require("../lib/mailService")


//verifies the user
const otpVerify = async(req, res) => {
    const {otp, email} = req.body
    try {
        const user = await User.findOne({email})
        //checks for the user in the database
        if (!user) {
            return res.status(400).json({msg: 'User not found.'})
        }
        if (user.isVerified) {
            return res.status(400).json({msg: 'User already verified.'})
        }
        if (user.otp && user.otp !== otp) {
            return res.status(400).json({msg: 'OTP Invalid'})
        }
        if (user.otpInvalid < Date.now()) {
            return res.status(400).json({msg: 'OTP has expired.'})
        }

        user.otp = undefined
        user.otpInvalid = undefined
        user.isVerified = true
        await user.save()
        try {
            const mailObj = {
                mailFrom: `Vendify ${process.env.VENDIFY_EMAIL}`,
                mailTo: email,
                subject: 'Welcome to Vendify! Your Account is Verified',
                body: `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #2c3e50;">Welcome to Vendify, <strong>${user.username}</strong>! 🎉</h2>
                    <p>Your account has been successfully verified.</p>
                    <p>You can now proceed to log in and start exploring our platform.</p>
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="${process.env.VENDIFY_LOGIN_URL || 'https://vendify.com/login'}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Proceed to Login</a>
                    </div>
                    <p style="font-size: 0.9em; color: #777; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
                        If you have any questions, feel free to contact our support team.
                    </p>
                    <p style="font-size: 0.9em; color: #777;">Best Regards,<br/><strong>The Vendify Team</strong></p>
                </div>
                `
            }
        sendMail(mailObj)
        }
        catch (error) {console.log(error)}
        res.status(200).json({msg: 'Your account has been verified. Proceed to login.'})
    } catch (error) {res.status(500).json({msg: error})}
}

const otpResend = async(req, res) => {
    const {email} = req.body
    const time = Date.now()
    try {
        const user = await User.findOne({email})
        //checks for the user in the database
        if (!user) {
            return res.status(400).json({msg: 'User not found.'})
        }
        if (user.isVerified) {
            return res.status(400).json({msg: 'User already verified.'})
        }
        //utilizing rate limiting to reduce the amount of otp generated
        if ((time - user.lastOPTsent) < 60 * 1000) {
            return res.status(400).json({msg: 'Please wait for 20 minutes more'})
        }
        const {otp, otpInvalid} = generateOTP()
        user.otp = otp
        user.otpInvalid = otpInvalid
        user.lastOPTsent = time
        await user.save()
        res.status(200).json({msg: 'new OTP generated.'})
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    otpVerify,
    otpResend
}