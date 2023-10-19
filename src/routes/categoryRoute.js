const express = require('express')
const router = express.Router()
const { getCategorys, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controller/categoryController')
const { jwtMiddleware, isAdmin } = require('../middlewares/jwtMiddleware')

router.get('/', getCategorys)
router.get('/:id', getCategoryById)
router.post('/', jwtMiddleware, isAdmin, createCategory)
router.put('/:id', jwtMiddleware, isAdmin, updateCategory)
router.delete('/:id', jwtMiddleware, isAdmin, deleteCategory)

module.exports = router