const express = require('express')
const router = express.Router()
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, addToWishList, rating, uploadImages } = require('../controller/productController')
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages')
const { jwtMiddleware, isAdmin } = require('../middlewares/jwtMiddleware')

router.get('/', getProducts)
router.get('/:id', getProductById)
router.put('/wishlist', jwtMiddleware, addToWishList)
router.put('/rating', jwtMiddleware, rating)
router.put('/upload/:id', jwtMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImages)
router.post('/', jwtMiddleware, isAdmin, createProduct)
router.put('/:id', jwtMiddleware, isAdmin, updateProduct)
router.delete('/:id', jwtMiddleware, isAdmin, deleteProduct)

module.exports = router