const express = require('express')
const productRouter = require('./routers/productRouter')
const userRouter = require('./routers/userRouter')
// gives access to the .env file
require('dotenv').config()
const connectDB = require('./db/db')
const cookieParser = require('cookie-parser')
const authRouter = require('./routers/authRouter')
const { otpRouter } = require('./routers/otpRouter')
const cartRouter = require('./routers/cartRouter')
const categoryRouter = require('./routers/categoryRouter')

connectDB()

const port = process.env.port
server = express()

// middlewares that helps us able to send urlencoded and json data to the request body 
server.use(express.json())
server.use(express.urlencoded({
    extended: true
}))
// middleware that allows us to parse cookie because our application cannot read cookies by default
server.use(cookieParser())
server.use('/api', otpRouter)
server.use('/api', authRouter)
server.use('/api', productRouter)
server.use('/api', userRouter)
server.use('/api', cartRouter)
server.use('/api', categoryRouter)

server.listen(port, () => {
    console.log(`Server is listening on port ${port}.`)
})