const express = require('express')
const router = express.Router()
const { uploadImages, deleteImages } = require('../controller/uploadController')
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages')
const { jwtMiddleware, isAdmin } = require('../middlewares/jwtMiddleware')

router.post('', jwtMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImages)
router.delete("/:id", jwtMiddleware, isAdmin, deleteImages);
module.exports = router