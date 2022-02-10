const mongoose = require('mongoose');

module.exports = mongoose.model('Category', {
    name: {
        type: String,
        unique: true,
    },
    channelId: {
        type: String,
        unique: true,
    },
    parent: String,
});
