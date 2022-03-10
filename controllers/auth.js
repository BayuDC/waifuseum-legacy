const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const HttpError = require('../lib/http-error');

const secret = process.env.JWT_SECRET;
const maxAge = 24 * 60 * 60;

module.exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return next(new HttpError(404, { username: 'User not found' }));

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) return next(new HttpError(401, { password: 'Incorrect password!' }));

    const payload = {
        user: {
            username: user.username,
            manageUser: user.manageUser,
            manageContent: user.manageContent,
        },
    };
    const token = jwt.sign(payload, secret, { expiresIn: maxAge });

    res.cookie('token', token, { httpOnly: true, maxAge: maxAge * 1000, domain: 'waifuseum.my.id' });
    res.status(201).send();
};
module.exports.logout = (req, res, next) => {
    res.clearCookie('token');
    res.sendStatus(204);
};

module.exports.status = (req, res) => {
    if (!req.user) return res.status(401).send();

    res.json({ user: req.user });
};
