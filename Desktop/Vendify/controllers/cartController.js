

const Cart = require("../schema/cartSchema")
const Product = require("../schema/productSchema")


const createCart = async (req, res) => {
    const {productId} = req.params
    const {user} = req.user
    try {
        const product = await Product.findById(id)
        if (!product) return res.status(404).json({msg: 'Product not found.'})
        let userCart = await Cart.findOne({userId: user._id})
        if (!userCart) {
           userCart = new Cart()
           products: [
            {
                productId: productId,
                quantity: 1,
                price: product.price
            }
           ]
        } else {
            const Itemincart = cart.products.find(item => item.productId.toString() === productId)
            if (Itemincart) {
                Itemincart.quantity += 1
            } else {
                cart.product.push({
                    productId: productId,
                    quantity: 1,
                    price: product.price
                })
            }
        }
        //update the total for each item
        Cart.products.forEach(item => {
            item.totalItemPrice = item.price * item.quantity
            });
        //update the cart total
        const totalCartItemPrice = Cart.products.reduce((accumulator, currentItem) => accumulator + currentItem.totalItemPrice, 0)
        Cart.totalcartPrice = totalCartItemPrice
        //save cart
        await Cart.save()
        res.status(200).json({msg: products})
    } catch (error) {
        res.status(500).json({
            msg: error.message
        })
    }
}

const getCart = async (req, res) => {
    const {user} = req.user
    try {
        const cartItems = await cart.findOne({userId: user._id}).populate('product.productId', '-userId -color -size')
        if (!cartItems) return res.status(404).json({msg: "No items found"})
        res.status(200).json(cartItems)
    } catch (error) {
        console.log(error)
    }
}

const editCart = async (req, res) => {
    const {user} = req.user
    const {productId, type} = req.body
    if (!productId || !type) return res.status(400).json({msg: 'Please provide all fields.'})
    try {
        const cart = await Cart.findOne({userId: user._id})
        if (!cart) return res.status(404).json({msg: 'Your cart is empty'})
        const itemInCart = cart.products.find(item => item.productId.toString() === productId)
        if (type == 'decrease' && itemInCart.quantity >= 1) {
            itemInCart.quantity -= 1
        } else if (type == 'increase') {
            itemInCart.quantity += 1
        } else {
            res.status(400).json({msg: 'Type can only be increase or decrease.'})
        }

        //update the total for each item
        Cart.products.forEach(item => {
            item.totalItemPrice = item.price * item.quantity
            });
        //update the cartItems total
        const totalCartItemPrice = Cart.products.reduce((accumulator, currentItem) => accumulator + currentItem.totalItemPrice, 0)
        Cart.totalcartPrice = totalCartItemPrice
        //save cart
        await Cart.save()
        res.status(200).json({msg: 'Product updated successfully.'})
        
    } catch (error) {
        console.log(error)
    } 
}

const deleteCartItem = async (req, res) => {
    const {productId} = req.params
    const {user} = req.user
    try {
        const cart = await Cart.findOne({userId: user._id})
        if (!cart) return res.status(404).json({msg: 'Your cart is empty'})
        const deleted = cart.products.findByIdAndDelete(productId)
        if (deleted) return res.status(200).json({msg: 'Product was removed from cart.'})
    } catch (error) {
        console.log(error)
    }
}

const deleteAllCartItem = async (req, res) => {
    const {user} = req.user
    try {
        const cart = await Cart.findOne({userId: user._id})
        if (!cart) return res.status(404).json({msg: 'Your cart is empty'})
        let productsDeleted = cart.products
        productsDeleted = []
        cart.totalCartItemPrice = 0
        if (productsDeleted) {
            await cart.save()
        } 
        res.status(200).json({msg: 'Product was removed from cart.'})
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    createCart,
    getCart,
    editCart,
    deleteCartItem,
    deleteAllCartItem
}