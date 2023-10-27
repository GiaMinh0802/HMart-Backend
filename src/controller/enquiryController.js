const Enquiry = require("../models/enquiryModel");
const asyncHandler = require("express-async-handler");
const validateID = require("../utils/validate");

const getEnquiries = asyncHandler(async (req, res) => {
    try {
        const findEnquiry = await Enquiry.find()
        res.json(findEnquiry)
    } catch (error) {
        throw new Error(error)
    }
})

const getEnquiryById = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        const findEnquiry = await Enquiry.findById(id)
        res.json(findEnquiry)
    } catch (error) {
        throw new Error(error)
    }
});

const createEnquiry = asyncHandler(async (req, res) => {
    try {
        const newEnquiry = await Enquiry.create(req.body)
        res.json(newEnquiry);
    } catch (error) {
        throw new Error(error);
    }
})
const updateEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, { new: true })
        res.json(updatedEnquiry)
    } catch (error) {
        throw new Error(error)
    }
})
const deleteEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
        res.json(deletedEnquiry)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = { getEnquiries, getEnquiryById, createEnquiry, updateEnquiry, deleteEnquiry }