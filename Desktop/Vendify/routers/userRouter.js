const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { getAllUsers, getOneUser, createUser, updateUser, deleteUser } = require('../controllers/userController')



const userRouter = express.Router()

userRouter
    // GETS ALL USERS FROM THE DATABASE
    .get('/users', getAllUsers)

    // GETS A SINGLE USER FROM THE DATABASE
    .get('/user/:id', getOneUser)

    // CREATES NEW USER
    .post('/user/SignUp', createUser)

    // UPDATES USER IN THE DATABASE
    .put('/user/:id', authMiddleware, updateUser)

    // DELETE USER FROM THE DATABASE
    .delete('/user/:id', authMiddleware, deleteUser)


module.exports = userRouter