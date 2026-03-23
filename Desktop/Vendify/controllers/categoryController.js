const Category = require("../schema/categorySchema")


const createCategory = async (req, res) => {
    try {
        const {name} = req.body
        if (!name) res.status(400).json({msg: 'Name field cannot be empty.'})
        const category = await Category.findOne({name})
        if (category) {
            res.status(400).json({msg: 'The category is already in db.'})
        }
        const newCategory = new Category({name})
        await newCategory.save()
        res.status(201).json({msg: 'New Category added'})

    } catch (error) {
        console.log(error)
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        if (!categories) {
            res.status(400).json({msg: 'TNo category found.'})
        }
        res.status(200).json(categories)

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    createCategory,
    getCategories
}