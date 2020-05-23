const mongoose = require('mongoose');

const symptomSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ques: {type: Array, required: true},
    num: {type: String, required: true},
});

module.exports = mongoose.model('Symptom', symptomSchema);