const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    interviwer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    slots: [{ start : Date, end : Date }]
});

module.exports = mongoose.model('interviewSlot', Schema);