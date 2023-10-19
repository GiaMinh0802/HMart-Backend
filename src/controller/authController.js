const { generateAccessToken, generateRefreshToken } = require('../config/jwtToken')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const validateID = require('../utils/validate')
const sendEmail = require('./emailController')
const crypto = require('crypto')

const register = asyncHandler(async (req, res) => {
    const email = req.body.email
    try {
        const findUser = await User.findOne({ email: email })
        if (!findUser) {
            await User.create(req.body)
            res.json({ message: 'Successfully' })
        } else {
            res.status(400).json({ message: 'Account already exists' })
        }
    } catch (error) {
        throw new Error(error)
    }
})

const registerAdmin = asyncHandler(async (req, res) => {
    const email = req.body.email
    try {
        const findUser = await User.findOne({ email: email })
        if (!findUser) {
            const user = req.body
            user.role = 'admin'
            await User.create(user)
            res.json({ message: 'Successfully' })
        } else {
            res.status(400).json({ message: 'Account already exists' })
        }
    } catch (error) {
        throw new Error(error)
    }
})

const login = asyncHandler(async (req, res) => {
    const password = req.body.password
    const user = req.user
    try {
        if (await user.isPasswordMatched(password)) {
            const refreshToken = await generateRefreshToken(user.email, user._id)
            await User.findOneAndUpdate(user._id, { refreshToken })
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            res.json({
                _id: user?._id,
                firstname: user?.firstname,
                lastname: user?.lastname,
                email: user?.email,
                mobile: user?.mobile,
                role: user?.role,
                accessToken: await generateAccessToken(user.email, user._id)
            })
        } else {
            res.status(401).json({ message: 'Incorrect password' })
        }
    } catch (error) {
        throw new Error(error)
    }
})

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.refreshToken) {
        throw new Error("No Refresh Token in Cookies")
    }
    const refreshToken = cookies.refreshToken
    const user = await User.findOne({ refreshToken })
    if (!user) {
        res.status(403).json({ message: "Account is logout" })
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong refresh token")
        }
        const accessToken = generateAccessToken(user.email, user._id)
        res.json({ accessToken })
    })
})

const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.refreshToken) {
        throw new Error("No Refresh Token in Cookies")
    }
    const refreshToken = cookies.refreshToken
    const user = await User.findOne({ refreshToken })
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        })
        res.status(204)
    }
    await User.findOneAndUpdate(user._id, { refreshToken: "" })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    })
    res.json({ message: "Logged out" })
})

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    try {
        const findUser = await User.findOne({ email: email })
        if (!findUser) {
            res.status(400).json({ message: 'Account not found' })
        }
        const token = await findUser.createPasswordResetToken()
        await findUser.save()
        const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from new. <a href='http://localhost:8080/api/auth/reset-password/${token}'>Click Here</>`
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            html: resetURL
        }
        try {
            await sendEmail(data)
        } catch (error) {
            throw new Error(error)
        }
        res.json({message: "Sent a email"})
    } catch (error) {
        throw new Error(error)
    }
})

const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body
    const { token } = req.params
    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest("hex")
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        })
        if (!user) throw new Error("Token expired")
        user.password = password
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save()
        res.json({message: "Reseted password"})
    } catch (error) {
        throw new Error(error)
    }
})

const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { password } = req.body
    validateID(_id)
    try {
        const user = await User.findById(_id)
        if (password) {
            user.password = password
            await user.save()
            res.json({ message: "Updated password" })
        } else {
            res.status(400).json({ message: "Cannot change password" })
        }
    } catch (error) {
        throw new Error(error)
    }

})

module.exports = {
    register,
    registerAdmin,
    login,
    handleRefreshToken,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword
}