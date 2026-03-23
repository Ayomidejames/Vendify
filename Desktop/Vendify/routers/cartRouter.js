const express = require('express')
const cartRouter = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const { createCart, deleteCartItem, deleteAllCartItem, editCart, getCart } = require('../controllers/cartController')

cartRouter
    //create cart
    .post('/addcart', authMiddleware, createCart)
    //update cart
    .put('/cart/:id', editCart)
    //get cart
    .get('/cart', getCart)
    //delete cart
    .delete('/cartItem/:productId', deleteCartItem)
    //delete cart
    .delete('/allCartItem', deleteAllCartItem)

module.exports = cartRouter