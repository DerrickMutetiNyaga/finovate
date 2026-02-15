const mongoose = require('mongoose');

const logoSchema = new mongoose.Schema({
    logoName: { type: String, required: true },
    date: { type: Date, required: true },
    image: { type: String, required: true }
});

module.exports = mongoose.model('Logo', logoSchema);
