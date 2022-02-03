const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const HttpError = require('../lib/http-error');

const secret = process.env.JWT_SECRET;
const maxAge = 24 * 60 * 60;

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return next(new HttpError(404, 'User not found'));

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) return next(new HttpError(401, 'Incorrect password!'));

    const token = jwt.sign({ user: user._id }, secret, { expiresIn: maxAge });

    res.cookie('token', token, { httpOnly: true, maxAge: maxAge * 1000, secure: true });
    res.json({ userId: user._id });
});

router.delete('/logout', (req, res) => {
    res.clearCookie('token');
    res.sendStatus(204);
});

module.exports = router;