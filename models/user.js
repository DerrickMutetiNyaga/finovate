const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 20 },
    email: { type: String, required: true, unique: true, maxlength: 40 },
    password: { type: String, required: true, minlength: 6 }, // Ensure a minimum length for security
    role: { type: String, default: 'user', enum: ['user', 'admin', 'superadmin'] }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
