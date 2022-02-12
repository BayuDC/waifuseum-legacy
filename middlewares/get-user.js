const jwt = require('jsonwebtoken');
const User = require('../models/user');

const secret = process.env.JWT_SECRET;

module.exports = () => {
    return async (req, res, next) => {
        try {
            const token = req.cookies.token;
            if (!token) throw token;

            const payload = jwt.verify(token, secret);
            req.user = await User.findById(payload.user);
        } catch (err) {
            req.user = null;
        }
        next();
    };
};
