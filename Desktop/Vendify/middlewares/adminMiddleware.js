const jwt = require('jsonwebtoken')
const User = require('../schema/userSchema')
const adminMiddleware = async (req, res, next) => {
    const token = req.cookies.token
    const jwtsecret = process.env.JWT_SECRET
    if (!token) {
        return res.status(401).json({msg: 'please login or register to continue'})
    }
    try {
        // verifying the secret in the token if it is valid
        const verifiedToken = jwt.verify(token, jwtsecret)
        if (!verifiedToken) {
            return res.status(401).json({msg: 'Secret is invalid.'})
        }
        const user = await User.findById({_id: verifiedToken.id}).select("-password")
        if (!user && !user.isAdmin) {
            return res.status(401).json({msg: 'You do not have acccess.'})
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
    
}

module.exports = adminMiddleware