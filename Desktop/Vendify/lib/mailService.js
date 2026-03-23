const nodemailer = require('nodemailer') //nodemailer helps us to send email through mail providers
const crypto = require('crypto') //crypto module generates random token

const generateOTP = () => {
    return {
        otp: Math.floor(100000 + Math.random() * 900000).toString(),
        otpInvalid: new Date(Date.now() + (20 * 60 * 1000)),  //expiration time for otp
        passwordResetToken: crypto.randomBytes(32).toString('hex')
    }
} 

const sendMail = async ({mailFrom, mailTo, subject, body}) => {
    try {
        //verify our app
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.VENDIFY_EMAIL,
                pass: process.env.EMAIL_PASSKEY
            }
        })
        // send mail
        const info = await transporter.sendMail({
            from: mailFrom,
            to: mailTo,
            subject,
            html: body
        })
        return info
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    generateOTP,
    sendMail
}