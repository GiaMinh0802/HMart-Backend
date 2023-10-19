const mongoose = require('mongoose')

var colorSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    }
}, { timestamp: true })

module.exports = mongoose.model('Color', colorSchema)