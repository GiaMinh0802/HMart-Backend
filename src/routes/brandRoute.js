const express = require('express')
const router = express.Router()
const { getBrands, getBrandById, createBrand, updateBrand, deleteBrand } = require('../controller/brandController')
const { jwtMiddleware, isAdmin } = require('../middlewares/jwtMiddleware')

router.get('/', getBrands)
router.get('/:id', getBrandById)
router.post('/', jwtMiddleware, isAdmin, createBrand)
router.put('/:id', jwtMiddleware, isAdmin, updateBrand)
router.delete('/:id', jwtMiddleware, isAdmin, deleteBrand)

module.exports = router