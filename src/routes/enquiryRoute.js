const express = require('express')
const router = express.Router()
const { getEnquiries, getEnquiryById, createEnquiry, updateEnquiry, deleteEnquiry } = require('../controller/enquiryController')
const { jwtMiddleware, isAdmin } = require('../middlewares/jwtMiddleware')

router.get('/', getEnquiries)
router.get('/:id', getEnquiryById)
router.post('/', jwtMiddleware, isAdmin, createEnquiry)
router.put('/:id', jwtMiddleware, isAdmin, updateEnquiry)
router.delete('/:id', jwtMiddleware, isAdmin, deleteEnquiry)

module.exports = router