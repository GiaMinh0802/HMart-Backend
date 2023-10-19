const Category = require('../models/categoryModel')
const asyncHandler = require('express-async-handler')
const validateID = require('../utils/validate')

const getCategorys = asyncHandler(async (req, res) => {
    try {
        const findCategory = await Category.find()
        res.json(findCategory)
    } catch (error) {
        throw new Error(error)
    }
})


const getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        const findCategory = await Category.findById(id)
        res.json(findCategory)
    } catch (error) {
        throw new Error(error)
    }
})


const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await Category.create(req.body)
        res.json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
})

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true })
        res.json(updatedCategory)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        await Category.findByIdAndDelete(id)
        res.json({ message: "Deleted category" })
    } catch (error) {
        throw new Error(error)
    }
})


module.exports = { getCategorys, getCategoryById, createCategory, updateCategory, deleteCategory }