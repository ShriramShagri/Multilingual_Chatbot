const mongoose = require('mongoose');

const precautionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ques: {type: Array, required: true},
    num: {type: String, required: true},
});

module.exports = mongoose.model('Precaution', precautionSchema);