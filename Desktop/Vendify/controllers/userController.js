const { sendMail, generateOTP } = require("../lib/mailService")
const User = require("../schema/userSchema")
const bcrypt = require("bcrypt")


// FUNCTION THAT GETS ALL USERS FROM THE DATABASE
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        if(users.length === 0) {
            return res.status(404).json({
            msg: 'No user in database'   
            })
            
        } else {
            res.status(200).json(users)
        }
    } catch (error) {
        res.status(500).json({
            msg: error.message
        })
    }
}

// FUNCTION THAT GETS A SINGLE USER FROM THE DATABASE
const getOneUser = async (req, res) => {
    try {
        // retrieves the id passed into the request body
       const {id} = req.params
        const user = await User.findById(id)
        if (!user) {
            res.status(404).json({msg: 'user not found'})
        } return res.status(200).json(user)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

// FUNCTION CREATES NEW USER TO THE DATABASE
const createUser = async (req, res) => {
    try {
        // destructuring the request body
        const { username, email, password} =  req.body
        if (!username || !email || !password) {
            res.status(400).json({msg: "All fields are required."})
        } else {
            // checking if a user already exists in the database
            const existingUser = await User.findOne({email})
            if (existingUser) {
                res.json({msg: 'User already exist'})
                return
            }
            const hashedPassword = await bcrypt.hash(password, 10)
            
            //Generate otp
            const {otp, otpInvalid} = generateOTP()
            const newUser = new User ({ 
                ...req.body, password: hashedPassword, otp, otpInvalid
            })
            if (email == process.env.SUPERADMIN) {
                newUser.superAdmin = true
                newUser.isAdmin = true
            }
            // replaced username, email with ...req.body. This automatically takes the requests from the request body.
            await newUser.save()
            try {
                const mailObj = {
                    mailFrom: `Vendify ${process.env.VENDIFY_EMAIL}`,
                    mailTo: email,
                    subject: 'Vendify - Your OTP Verification Code',
                    body:`
                    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
                        <h2 style="color: #2c3e50;">Hello <strong>${username}</strong>,</h2>
                        <p>Thank you for signing up with Vendify!</p>
                        <p>Your One-Time Password (OTP) for account verification is:</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <span style="background-color: #f8f9fa; padding: 15px 30px; font-size: 24px; font-weight: bold; letter-spacing: 4px; border-radius: 5px; border: 1px dashed #ccc;">
                                ${otp} </span>
                        </div>
                        <p>Please enter this code on the verification page. This code will expire in 10 minutes.</p>
                        <p style="font-size: 0.9em; color: #777; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
                            If you did not request this, please ignore this email or contact support if you have concerns.
                        </p>
                        <p style="font-size: 0.9em; color: #777;">Best Regards,<br/><strong>The Vendify Team</strong>💙</p>
                    </div>
                `
                }
            const info = sendMail(mailObj)
            console.log(info)
            } catch (error) {
                return res.status(500).json({msg: error})
            }
            return res.status(200).json(newUser)
            }

            
        }
    catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
}

// FUNCTION UPDATES EXISTING USER IN THE DATABASE
const updateUser = async (req, res) => {
    const {user} = req.user
    const { username, email, password} = req.body
    const {id} = req.params 
    if (id === user._id) {
        try {
            const user = await Product.findByIdAndUpdate(id,
                {username, email, password},
                // returning the new user after update
                {new: true}
            )
            if (!user) {
                res.status(400).json({
                    message: `product with id ${id} not found.`
                })
            }
            res.status(200).json(user)
        } catch (error) {
        res.status(500).json({
                msg: error.message}) 
        }        
    } else {
        return res.status(400).json({msg: "Account doesn't belong to you."})
    }   

}

// FUNCTION DELETES EXISTING USER IN THE DATABASE
const deleteUser = async (req, res) => {
    const {user} = req.user
    const users = await User.find()
    const {id} = req.params
    if (id === user._id || user.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(id)
            if (!user) {
                res.status(400).json({
                    message: `product with id ${id} not found.`
                })
            }
            res.status(200).json(users)
        } catch (error) {
            res.status(500).json({
                msg: error.message
            })
        }
    } else {

    }
}



module.exports = {
    getAllUsers,
    getOneUser,
    createUser,
    updateUser,
    deleteUser
}