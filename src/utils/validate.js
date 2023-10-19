const mongoose = require('mongoose')
const validateID = (id => {
    const isValid = mongoose.Types.ObjectId.isValid(id)
    if (!isValid) 
        throw new Error("ID is not valid or not found")
})

module.exports = validateID