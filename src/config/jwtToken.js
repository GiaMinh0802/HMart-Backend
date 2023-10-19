const jwt = require('jsonwebtoken')

const generateAccessToken = (email, id) => {
    return jwt.sign({ email, id, "Type": "Access Token" }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

const generateRefreshToken = (email, id) => {
    return jwt.sign({ email, id, "type": "Refresh Token" }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

module.exports = { generateAccessToken, generateRefreshToken }