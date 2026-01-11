const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResetPassSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_mst',
        required: true
    },
    reset_token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('reset_pass_mst', ResetPassSchema);
