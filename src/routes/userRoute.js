const express = require('express')
const router = express.Router()
const {
    getUsers,
    getUserById,
    deleteUser,
    updateUser,
    saveAddress,
    blockUser,
    unblockUser,
    getWishlist,
    userCart,
    getUserCart,
    removeProductFromCart,
    removeCart,
    updateQuantityProductFromCart,
    createOrder,
    getUserOrder,
    getAllOrders,
    getOrder
} = require('../controller/userController')
const { jwtMiddleware, isAdmin } = require('../middlewares/jwtMiddleware')

router.get('/wishlist', jwtMiddleware, getWishlist)

router.post('/cart', jwtMiddleware, userCart)
router.get('/cart', jwtMiddleware, getUserCart)
router.delete('/cart', jwtMiddleware, removeCart)
router.delete('/cart/:id', jwtMiddleware, removeProductFromCart)
router.put('/cart/:id/:newQuantity', jwtMiddleware, updateQuantityProductFromCart)

router.post('/order', jwtMiddleware, createOrder)
router.get('/order', jwtMiddleware, getUserOrder)
router.get('/order/:id', jwtMiddleware, isAdmin, getOrder)
router.get('/all-order', jwtMiddleware, isAdmin, getAllOrders)


router.get('/', getUsers)
router.get('/:id', jwtMiddleware, getUserById)
router.put('/', jwtMiddleware, updateUser)
router.put('/address', jwtMiddleware, saveAddress)

router.delete('/:id', jwtMiddleware, isAdmin, deleteUser)
router.post('/block/:id', jwtMiddleware, isAdmin, blockUser)
router.post('/unblock/:id', jwtMiddleware, isAdmin, unblockUser)

module.exports = router;