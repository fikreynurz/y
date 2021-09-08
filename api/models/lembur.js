const mongoose = require('mongoose')

const lemburSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    assignee: { type: String, required: true },
    assigner: { type: String, required: true },
    reasons: { type: Array, required: true},
    time: { type: String, required: true },
    // lemburImage: { type: String, required: true }
})

module.exports = mongoose.model('Lembur', lemburSchema)