const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const checkExits = asyncHandler(async (req, res, next) => {
    const { email } = req.body
    try {
        const findUser = await User.findOne({ email: email })
        if (findUser) {
            req.user = findUser
            next()
        } else {
            res.status(400).json({ message: 'Account is not registered' })
        }
    } catch (error) {
        throw new Error(error)
    }
})

const isBlocked = asyncHandler(async (req, res, next) => {
    const user = req.user
    try {
        if (!user.isBlocked) {
            next()
        } else {
            res.status(400).json({ message: "Account is blocked"})
        }
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = { checkExits, isBlocked }