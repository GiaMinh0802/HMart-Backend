const express = require('express')
const router = express.Router()
const { getColors, getColorById, createColor, updateColor, deleteColor } = require('../controller/colorController')
const { jwtMiddleware, isAdmin } = require('../middlewares/jwtMiddleware')

router.get('/', getColors)
router.get('/:id', getColorById)
router.post('/', jwtMiddleware, isAdmin, createColor)
router.put('/:id', jwtMiddleware, isAdmin, updateColor)
router.delete('/:id', jwtMiddleware, isAdmin, deleteColor)

module.exports = router