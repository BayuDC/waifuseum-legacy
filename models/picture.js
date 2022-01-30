const mongoose = require('mongoose');

module.exports = mongoose.model('Pictures', {
    url: String,
    sauce: String,
    category: String,
    messageId: {
        type: String,
        unique: true,
    },
});
