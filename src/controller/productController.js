const Product = require('../models/productModel')
const User = require("../models/userModel");
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const validateID = require('../utils/validate')
const axios = require('axios')

const getProductRecommenders = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const findUser = await User.findById(_id);
    if (!findUser) {
        throw new Error("User doesnot exist!");
    }
    try {
        const products_rec = await axios.get(`http://localhost:8888/recommenders/${_id}`);
        const product_data = products_rec.data;
        const product_ids = Object.keys(product_data)
        const productPromises = product_ids.map(async (product_id) => {
            const product = await Product.findById(product_id)
            return product
        })
        let products = await Promise.all(productPromises)
        if (products.length < 8) {
            let additionalProduct = await Product.aggregate([
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        totalrating: 1,
                        images: 1,
                        brand: 1,
                        price: 1,
                        totalrating: 1,
                        ratingsCount: { $size: "$ratings" }
                    }
                },
                {
                    $sort: { ratingsCount: -1 }
                },
                {
                    $limit: 8 - products.length
                }
            ])
            products = products.concat(additionalProduct)
        }
        res.json(products)
    } catch (error) {
        throw new Error(error)
    }
});

const getProductsForRecommenders = asyncHandler(async (req, res) => {
    try {
        const getProducts = await Product.find().select("_id").select("title")
        const formattedProducts = getProducts.map(product => ({
            productId: product._id,
            title: product.title,
        }))
        res.json(formattedProducts)
    } catch (error) {
        throw new Error(error)
    }
})


const getRatingsForRecommenders = asyncHandler(async (req, res) => {
    try {
        const productsWithRatings = await Product.find({ "ratings": { $exists: true, $ne: [] } }).select("_id ratings.postedby ratings.star")
        const formattedRatings = []
        productsWithRatings.forEach(product => {
            const productId = product._id
            product.ratings.forEach(rating => {
                const formattedRating = {
                    productId: productId,
                    userId: rating.postedby,
                    rating: rating.star
                }
                formattedRatings.push(formattedRating)
            })
        })
        res.json(formattedRatings)
    } catch (error) {
        throw new Error(error)
    }
})

const getProducts = asyncHandler(async (req, res) => {
    try {
        // Filtering
        const queryObj = { ...req.query }
        const excludeFields = ['page', 'sort', 'limit', 'fields']
        excludeFields.forEach((el) => delete queryObj[el])
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        let query = Product.find(JSON.parse(queryStr))

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ")
            query = query.sort(sortBy)
        } else {
            query = query.sort("-createAt")
        }

        // Limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ")
            query = query.select(fields)
        } else {
            query = query.select("-__v")
        }

        // Pagination
        const page = req.query.page
        const limit = req.query.limit
        const skip = (page - 1) * limit
        query = query.skip(skip).limit(limit)
        if (req.query.page) {
            const productCount = await Product.countDocuments()
            if (skip >= productCount)
                throw new Error('This page does not exists')
        }

        const product = await query
        res.json(product)
    } catch (error) {
        throw new Error(error)
    }
})

const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        const findProduct = await Product.findById(id).populate('color').populate('postedby')

        res.json(findProduct)
    } catch (error) {
        throw new Error(error)
    }
})

const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body)
        res.json(newProduct)
    } catch (error) {
        throw new Error(error)
    }
})

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true })
        res.json(updatedProduct)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        await Product.findByIdAndDelete(id)
        res.json({ message: "Deleted product" })
    } catch (error) {
        throw new Error(error)
    }
})

const addToWishList = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { prodId } = req.body
    try {
        const user = await User.findById(_id)
        const alreadyadded = user.wishlist.find((id) => id.toString() === prodId)
        if (alreadyadded) {
            let user = await User.findByIdAndUpdate(_id,
                {
                    $pull: { wishlist: prodId }
                },
                {
                    new: true
                }
            )
            res.json(user)
        } else {
            let user = await User.findByIdAndUpdate(_id,
                {
                    $push: { wishlist: prodId }
                },
                {
                    new: true
                }
            )
            res.json(user)
        }
    } catch (error) {
        throw new Error(error)
    }
})

const rating = asyncHandler(async (req, res) => {
    const { id, prodId, star, comment } = req.body
    try {
        const product = await Product.findById(prodId)
        let alreadyRated = product.ratings.find(
            (userId) => userId.postedby.toString() === id.toString()
        )
        if (alreadyRated) {
            const updateRating = await Product.updateOne(
                {
                    ratings: { $elemMatch: alreadyRated },
                },
                {
                    $set: { "ratings.$.star": star, "ratings.$.comment": comment },
                },
                {
                    new: true,
                }
            )
        } else {
            const rateProduct = await Product.findByIdAndUpdate(prodId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedby: id,
                        },
                    },
                },
                {
                    new: true,
                }
            )
        }
        const getallratings = await Product.findById(prodId);
        let totalRating = getallratings.ratings.length;
        let ratingsum = getallratings.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingsum / totalRating);
        let finalproduct = await Product.findByIdAndUpdate(
            prodId,
            {
                totalrating: actualRating,
            },
            { new: true }
        );
        res.json(finalproduct);
    } catch (error) {
        throw new Error(error)
    }
})

// const rating = asyncHandler(async (req, res) => {
//     const { _id } = req.user
//     const { prodId, star, comment } = req.body
//     try {
//         const product = await Product.findById(prodId)
//         let alreadyRated = product.ratings.find(
//             (userId) => userId.postedby.toString() === _id.toString()
//         )
//         if (alreadyRated) {
//             const updateRating = await Product.updateOne(
//                 {
//                     ratings: { $elemMatch: alreadyRated },
//                 },
//                 {
//                     $set: { "ratings.$.star": star, "ratings.$.comment": comment },
//                 },
//                 {
//                     new: true,
//                 }
//             )
//         } else {
//             const rateProduct = await Product.findByIdAndUpdate(prodId,
//                 {
//                     $push: {
//                         ratings: {
//                             star: star,
//                             comment: comment,
//                             postedby: _id,
//                         },
//                     },
//                 },
//                 {
//                     new: true,
//                 }
//             )
//         }
//         const getallratings = await Product.findById(prodId);
//         let totalRating = getallratings.ratings.length;
//         let ratingsum = getallratings.ratings
//             .map((item) => item.star)
//             .reduce((prev, curr) => prev + curr, 0);
//         let actualRating = Math.round(ratingsum / totalRating);
//         let finalproduct = await Product.findByIdAndUpdate(
//             prodId,
//             {
//                 totalrating: actualRating,
//             },
//             { new: true }
//         );
//         res.json(finalproduct);
//     } catch (error) {
//         throw new Error(error)
//     }
// })

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, addToWishList, rating, getProductRecommenders, getProductsForRecommenders, getRatingsForRecommenders }
