const Brand = require('../models/brandModel')
const asyncHandler = require('express-async-handler')
const validateID = require('../utils/validate')

const getBrands = asyncHandler(async (req, res) => {
    try {
        const findBrand = await Brand.find()
        res.json(findBrand)
    } catch (error) {
        throw new Error(error)
    }
})


const getBrandById = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        const findBrand = await Brand.findById(id)
        res.json(findBrand)
    } catch (error) {
        throw new Error(error)
    }
})


const createBrand = asyncHandler(async (req, res) => {
    try {
        const newBrand = await Brand.create(req.body)
        res.json(newBrand)
    } catch (error) {
        throw new Error(error)
    }
})

const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, { new: true })
        res.json(updatedBrand)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        await Brand.findByIdAndDelete(id)
        res.json({ message: "Deleted brand" })
    } catch (error) {
        throw new Error(error)
    }
})


module.exports = { getBrands, getBrandById, createBrand, updateBrand, deleteBrand }