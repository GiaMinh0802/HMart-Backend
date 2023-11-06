const User = require('../models/userModel')
const Cart = require('../models/cartModel')
const Product = require('../models/productModel')
const Order = require('../models/orderModel')
const asyncHandler = require('express-async-handler')
const validateID = require('../utils/validate')
const uniqid = require('uniqid')

const getUsers = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find()
        res.json(getUsers)
    } catch (error) {
        throw new Error(error)
    }
})

const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        const getUser = await User.findById(id)
        res.json(getUser)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        await User.findByIdAndDelete(id)
        res.json({ message: "Deleted user" })
    } catch (error) {
        throw new Error(error)
    }
})

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateID(_id)
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            mobile: req?.body?.mobile
        },
            {
                new: true
            })
        res.json(updatedUser)
    } catch (error) {
        throw new Error(error)
    }
})

const saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateID(_id)
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
            address: req?.body?.address
        },
            {
                new: true
            })
        res.json(updatedUser)
    } catch (error) {
        throw new Error(error)
    }
})

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        await User.findByIdAndUpdate(id, {
            isBlocked: true
        },
            {
                new: true
            })
        res.json({ message: "Block user" })
    } catch (error) {
        throw new Error(error)
    }
})

const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        await User.findByIdAndUpdate(id, {
            isBlocked: false
        },
            {
                new: true
            })
        res.json({ message: "Unblock user" })
    } catch (error) {
        throw new Error(error)
    }
})

const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateID(_id)
    try {
        const findUser = await User.findById(_id).populate("wishlist");
        res.json(findUser.wishlist);
    } catch (error) {
        throw new Error(error)
    }
})

const userCart = asyncHandler(async (req, res) => {
    const { productId, color, quantity, price } = req.body
    const { _id } = req.user
    validateID(_id)
    validateID(productId)
    try {
        let newCart = await new Cart({
            userId: _id,
            productId,
            color,
            quantity,
            price
        }).save()
        res.json(newCart)
    } catch (error) {
        throw new Error(error)
    }

})

const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateID(_id)
    try {
        const cart = await Cart.find({ userId: _id }).populate("productId").populate("color")
        if (cart) {
            res.json(cart)
        } else {
            res.json([])
        }

    } catch (error) {
        throw new Error(error)
    }
})

const removeProductFromCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { id } = req.params
    validateID(_id)
    validateID(id)
    try {
        await Cart.findOneAndRemove({ userId: _id, _id: id })
        res.json({ message: "Product Removed Cart" })
    } catch (error) {
        throw new Error(error)
    }
})

const removeCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateID(_id)
    try {
        await Cart.deleteMany({ userId: _id})
        res.json({ message: "Cart Removed" })
    } catch (error) {
        throw new Error(error)
    }
})

const updateQuantityProductFromCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { id, newQuantity } = req.params
    validateID(_id)
    validateID(id)
    try {
        const cartItem = await Cart.findOne({ userId: _id, _id: id })
        cartItem.quantity = newQuantity
        cartItem.save()
        res.json(cartItem)
    } catch (error) {
        throw new Error(error)
    }
})

const createOrder = asyncHandler(async (req, res) => {
    const { shippingInfo, orderItems, totalPrice } = req.body
    const { _id } = req.user
    validateID(_id)
    try {
        const order = await Order.create({ shippingInfo, orderItems, totalPrice, user: _id })
        res.json({ order })
    } catch (error) {
        throw new Error(error)
    }
})

const getUserOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateID(_id)
    try {
        const order = await Order.find({ user: _id })
            .populate("user")
            .populate("orderItems.product")
            .populate("orderItems.color")
        if (order) {
            res.json(order)
        } else {
            res.json([])
        }
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {
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
    getUserOrder
}