const express = require('express')
const adminMiddleware = require('../middlewares/adminMiddleware')
const { createCategory, getCategories } = require('../controllers/categoryController')

const categoryRouter = express.Router()

categoryRouter
    .post('/category', adminMiddleware, createCategory)
    .get('/getcategories', getCategories)

module.exports = categoryRouter