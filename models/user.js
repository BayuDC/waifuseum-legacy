const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: String,
    manageUser: Boolean,
    manageContent: Boolean,
});

module.exports = mongoose.model('User', userSchema);
