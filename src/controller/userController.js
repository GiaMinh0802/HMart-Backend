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
    const { cart } = req.body
    const { _id } = req.user
    validateID(_id)
    try {
        let products = []
        const alreadyExistCart = await Cart.findOne({ orderby: _id })
        if (alreadyExistCart) {
            await Cart.findOneAndRemove({ orderby: _id })
        }
        for (let i = 0; i < cart.length; i++) {
            let object = {}
            object.product = cart[i]._id
            object.count = cart[i].count
            object.color = cart[i].color
            let getPrice = await Product.findById(cart[i]._id).select("price").exec()
            object.price = getPrice.price
            products.push(object)
        }
        let cartTotal = 0
        for (let i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count
        }
        let newCart = await new Cart({
            products,
            cartTotal,
            orderby: _id
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
        const cart = await Cart.findOne({ orderby: _id }).populate("products.product")
        if (cart) {
            res.json(cart)
        } else {
            res.json([])
        }

    } catch (error) {
        throw new Error(error)
    }
})

const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateID(_id)
    try {
        await Cart.findOneAndRemove({ orderby: _id })
        res.json({ message: "Empty cart" })
    } catch (error) {
        throw new Error(error)
    }
});

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateID(_id)
    try {
        let userCart = await Cart.findOne({ orderby: _id })
        let amount = userCart.cartTotal
        await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: amount,
                created: Date.now(),
                currency: "USD"
            },
            orderby: _id,
            orderStatus: "Cash on Delivery"
        }).save()
        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } }
                }
            }
        })
        await Product.bulkWrite(update, {})
        res.json({ message: "Successfully" })
    } catch (error) {
        throw new Error(error)
    }
})

const getOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateID(_id)
    try {
        const userorders = await Order.findOne({ orderby: _id })
            .populate("products.product")
            .populate("orderby")
            .exec()
        res.json(userorders)
    } catch (error) {
        throw new Error(error)
    }
})

const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const alluserorders = await Order.find()
            .populate("products.product")
            .populate("orderby")
            .exec()
        res.json(alluserorders)
    } catch (error) {
        throw new Error(error)
    }
})

const getOrderByUserId = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        const userorders = await Order.findOne({ orderby: id })
            .populate("products.product")
            .populate("orderby")
            .exec();
        res.json(userorders);
    } catch (error) {
        throw new Error(error);
    }
})

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    validateID(id);
    try {
        const updateOrderStatus = await Order.findByIdAndUpdate(id, { orderStatus: status }, { new: true })
        res.json(updateOrderStatus);
    } catch (error) {
        throw new Error(error);
    }
});

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
    emptyCart,
    createOrder,
    getOrders,
    getAllOrders,
    getOrderByUserId,
    updateOrderStatus
}