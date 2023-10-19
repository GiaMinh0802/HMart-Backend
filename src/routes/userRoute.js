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
    emptyCart,
    createOrder,
    getOrders,
    getAllOrders,
    getOrderByUserId,
    updateOrderStatus
} = require('../controller/userController')
const { jwtMiddleware, isAdmin } = require('../middlewares/jwtMiddleware')

router.get('/wishlist', jwtMiddleware, getWishlist)

router.post('/cart', jwtMiddleware, userCart)
router.get('/cart', jwtMiddleware, getUserCart)
router.delete('/cart', jwtMiddleware, emptyCart)

router.get('/order', jwtMiddleware, getOrders)
router.post('/order', jwtMiddleware, createOrder)

router.get('/:id', jwtMiddleware, getUserById)
router.put('/', jwtMiddleware, updateUser)
router.put('/address', jwtMiddleware, saveAddress)

router.get('/', jwtMiddleware, isAdmin, getUsers)
router.delete('/:id', jwtMiddleware, isAdmin, deleteUser)
router.post('/block/:id', jwtMiddleware, isAdmin, blockUser)
router.post('/unblock/:id', jwtMiddleware, isAdmin, unblockUser)

router.put('/order/:id', jwtMiddleware, isAdmin, updateOrderStatus)

module.exports = router;