const Color = require('../models/colorModel')
const asyncHandler = require('express-async-handler')
const validateID = require('../utils/validate')

const getColors = asyncHandler(async (req, res) => {
    try {
        const findColor = await Color.find()
        res.json(findColor)
    } catch (error) {
        throw new Error(error)
    }
})


const getColorById = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        const findColor = await Color.findById(id)
        res.json(findColor)
    } catch (error) {
        throw new Error(error)
    }
})


const createColor = asyncHandler(async (req, res) => {
    try {
        const newColor = await Color.create(req.body)
        res.json(newColor)
    } catch (error) {
        throw new Error(error)
    }
})

const updateColor = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        const updatedColor = await Color.findByIdAndUpdate(id, req.body, { new: true })
        res.json(updatedColor)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteColor = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        await Color.findByIdAndDelete(id)
        res.json({ message: "Deleted color" })
    } catch (error) {
        throw new Error(error)
    }
})


module.exports = { getColors, getColorById, createColor, updateColor, deleteColor }