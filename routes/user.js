const router = require('express').Router();
const User = require('../models/user');
const HttpError = require('../lib/http-error');
const needPermission = require('../middlewares/need-permission');
const sanitizeUser = require('../middlewares/sanitize-user');

router.all('/user/:id?', needPermission('manageUser'), sanitizeUser());

router.post('/user', async (req, res, next) => {
    const { data } = res.locals;

    if (!data.username) return next(new HttpError(400, 'Username is required'));
    if (!data.password) return next(new HttpError(400, 'Password is required'));
    if (data.password?.length < 8) {
        return next(new HttpError(400, 'Minimum password length is 8 characters'));
    }

    const user = await User.create(data);

    res.status(201).json({
        user: {
            id: user._id,
            username: user.username,
            manageUser: user.manageUser,
            manageContent: user.manageContent,
        },
    });
});
router.put('/user/:id?', async (req, res, next) => {
    const { userId, data } = res.locals;

    if (data.password?.length < 8) {
        return next(new HttpError(400, 'Minimum password length is 8 characters'));
    }

    const user = await User.findByIdAndUpdate(userId, data, { new: true });
    if (!user) return next(new HttpError(404, 'User not found'));

    res.status(200).json({
        user: {
            id: user._id,
            username: user.username,
            manageUser: user.manageUser,
            manageContent: user.manageContent,
        },
    });
});
router.delete('/user/:id?', async (req, res, next) => {
    const { userId } = res.locals;

    const user = await User.findByIdAndDelete(userId);
    if (!user) return next(new HttpError(404, 'User not found'));

    res.status(204).send();
});

module.exports = router;
