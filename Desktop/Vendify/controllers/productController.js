const Category = require("../schema/categorySchema")
const Product = require("../schema/productSchema")

// GETTING THE PRODUCT
const getAllProduct = async (req, res) => {
    try { 
        const products = await Product.find().populate('userId', '-password')
        if (products.length !== 0) {
            res.status(200).json({
                products
            })   
        } else {
           res.status(404).json({msg: 'No data available'}) 
        }
        
    } catch (error) {
        res.json({
            error: error.message
        })
    }
}

const getProductByQuery = async (req, res) => {
    try { 
        const { name, color, size, category } = req.query
        const filter = {}
        if (query) {
            const foundCategory = await Category.findOne({name: category})
                if (!foundCategory) return res.status(404).json({msg: 'Category not found.'})
                filter.category = foundCategory
        }
        if (name) {
            filter.name = name
        }
        if (color) {
            filter.color = color
        }
        if (size) {
            filter.size = size
        }
        const products = await Product.find(filter).populate('category')
        
        if (!products) {
            products = await Product.find().populate('category')
            }
            return res.status(200).json(products) 
    } catch (error) {
        res.json({
            error: error.message
        })
    }
}

// GET A PRODUCT
const getProductById = async (req, res) => {
    try {
        const {id} = req.params
        product = await Product.findById(id)
        if (!product) {
            res.status(400).json({
                message: `product with id ${id} not found.`
            })
        }
        else {
            res.status(200).json(product)
        }
    } catch (error) {
        res.status(500).json({
            msg: error.message
        })
    }
}

// CREATE NEW PRODUCT
const createProduct = async (req, res) => {
    // destructuring the data in the req body
    const { name, price, color, imgUrl, size, category } = req.body
    const user = req.user
    
    if (!name || !price || !color || !imgUrl || !size || !category) {
        return res.status(400).json({msg: "All fields are required."})}
    const foundCategory = await Category.findOne({_id: category})
    if (!foundCategory) return res.status(404).json({msg: 'Category not found. Inform Admin to add category first.'})
    try {
        // destructuring the data in the req body
        const { name, price, color, imgUrl, size, category } = req.body
        const {user} = req.user
        
        if (!name || !price || !color || !imgUrl || !size || !category) {
            return res.status(400).json({msg: "All fields are required."})}
        const foundCategory = await Category.findOne({_id: category})
        if (!foundCategory) return res.status(404).json({msg: 'Category not found. Inform Admin to add category first.'})
        const new_product = new Product ({...req.body, userId: req.user._id})
        await new_product.save()
        res.status(200).json({message: 'New product created successfully.'})
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const user = req.user
        const { name, price, color } = req.body
        const {id} = req.params
        const product = await Product.findById(id)
        if (!product) {
            return res.status(400).json({
                message: `product with id ${id} not found.`
            })}
        if ((user._id).toString() === (product.userId).toString()) {
            const updated_product = await Product.findByIdAndUpdate(id, {name, price, color}, {new: true})
            return res.status(200).json(updated_product)
        } else {
            return res.status(403).json({msg: "You can only update your product."})
        }
        } catch (error) {
        res.status(500).json({msg: error.message})
    }
}
    

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    const user = req.user
    try {
        const {id} = req.params
        // const product = await Product.findByIdAndDelete(id)
        const product = await Product.findById(id)
        if (!product) {
            res.status(400).json({
                message: `product with id ${id} not found.`
            })
        }
        if (user._id !== product.userId) {
            return res.json({msg: "You can only delete your product."})
        }
        await product.deleteOne
        res.status(200).json({msg: "product deleted successfully."})
    } catch (error) {
        res.status(500).json({
            msg: error.message
        })
    }
}


module.exports = {
    getAllProduct,
    getProductByQuery,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}