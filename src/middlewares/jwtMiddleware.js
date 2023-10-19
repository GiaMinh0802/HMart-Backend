const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const jwtMiddleware = asyncHandler(async (req, res, next) => {
    let token
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                const user = await User.findById(decoded?.id)
                req.user = user
                next()
            }
        } catch (error) {
            throw new Error(error)
        }
    } else {
        res.status(403).json({ message: "No token attached to header" })
    }
}) 

const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user
    const admin = await User.findOne({ email })
    if (admin.role !== 'admin') {
        res.status(403).json({ message: "Access Denied" })
    } else {
        next()
    }
})

module.exports = { jwtMiddleware, isAdmin }