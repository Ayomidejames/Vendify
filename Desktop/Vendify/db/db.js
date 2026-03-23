const mongoose = require('mongoose')

const db = async () => {
    try {
        console.log("Connecting to mongoDB")
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected.")
    } catch (error) {
        res.status(500).json({
            msg: error.message
        })
    }
}
module.exports = db