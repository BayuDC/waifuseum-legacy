const mongoose = require('mongoose');

module.exports = mongoose.model('Picture', {
    url: String,
    sauce: String,
    category: String,
    messageId: {
        type: String,
        unique: true,
    },
});
