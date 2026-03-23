const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
    productId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product", // makes a reference to the product model from the productSchema
        },
        quantity: {
            type: Number
        },
        Price: {
            type: Number,
        },
        totalItemPrice: {
            type: Number 
        }
        
})

const cartSchema = new mongoose.Schema({
    userId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // makes a reference to the user model from the userSchema
            unique: true
        },
    product: [cartItemSchema],
    totalcartPrice: {type: Number}
        
}, {timestamps: true})

const Cart = mongoose.model('Cart', cartSchema)
module.exports = Cart