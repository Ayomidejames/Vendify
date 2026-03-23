const mongoose = require('mongoose');

// creating new schema - The schema defines the structure of the data to be accepted in the req body
const productSchema = new mongoose.Schema({
    // defining the data body - the data and data types
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // makes a reference to the user model from the userSchema
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    color: {
        type: String
    },
    imgUrl: {
        type: String
    },
    size: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, 
// generates the time new user is created or the time an existing user was modified.
{ timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;