const express = require('express')
const router = express.Router()
const { register, registerAdmin, login, forgotPassword, handleRefreshToken, logout, updatePassword, resetPassword} = require('../controller/authController')
const { checkExits, isBlocked } = require('../middlewares/authMiddleware')
const { jwtMiddleware } = require('../middlewares/jwtMiddleware')

router.post('/register', register)
router.post('/registerAdmin', registerAdmin)
router.post('/login', checkExits, isBlocked, login)
router.get('/refresh-token', handleRefreshToken)
router.get('/logout', logout)
router.put('/password', jwtMiddleware, updatePassword)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)

module.exports = router;