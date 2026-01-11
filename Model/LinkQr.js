
const mongoose = require('mongoose');

const LinkQrSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user_mst",
        required: true
    },
    qrlink: {
        type: String,
        required: true
    },
    qrcolor: {
        type: String,
        required: true
    },
    qr_status: {
        type: String,
        enum: ['enable', 'disable'],
        default: 'enable'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }


})
module.exports = mongoose.model("linkqr_mst", LinkQrSchema)
