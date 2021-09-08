const mongoose = require('mongoose')

const cutiSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: mongoose.Schema.Types.ObjectId, ref: 'Lembur', required:true },
    daysLong: { type: Number, default: 5 },
    reasons: { type: Array, required: true},
    startTime: { type: String, required: true }
})

module.exports = mongoose.model('Cuti', cutiSchema)