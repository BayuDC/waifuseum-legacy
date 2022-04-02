const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: String,
    manageUser: Boolean,
    manageServer: Boolean,
    manageContent: Boolean,
    discordId: {
        type: String,
        unique: true,
    },
});
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

module.exports = mongoose.model('User', userSchema);
