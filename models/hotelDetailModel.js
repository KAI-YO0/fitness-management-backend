const mongoose = require('mongoose')

const hoteldetailSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    title1: {
        type: String,
        required: true
    },
    title2: {
        type: String,
        required: true
    },
    title3: {
        type: String,
        required: true
    },
    title4: {
        type: String,
        required: true
    },
    title5: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
})

const hoteldetailModel = mongoose.model('hotels', hoteldetailSchema)
module.exports = hoteldetailModel;