const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { getAllProduct, createProduct, getProductById, deleteProduct, updateProduct } = require('../controllers/productController')

// const authMiddleware = require('../middlewares/authmiddleware')
const productRouter = express.Router()

productRouter
    // creates a new 
    .post('/product/', authMiddleware, createProduct)

    // gets all products
    .get('/products', getAllProduct)

    // gets one product
    .get('/product/:id', getProductById)

    // update product
    .put('/product/:id', authMiddleware, updateProduct)

    // delete product
    .delete('/product/:id', authMiddleware ,deleteProduct)

module.exports = productRouter