const { isValidObjectId } = require('mongoose');
const User = require('../models/user');
const HttpError = require('../class/http-error');

const toBool = value => {
    if (value == 'true') return true;
    if (value == 'false') return false;

    return undefined;
};

module.exports.sanitize = (req, res, next) => {
    const id = req.params.id || req.body.id;
    const { manageUser, manageContent, manageServer } = req.body;

    req.body.manageUser = toBool(manageUser);
    req.body.manageContent = toBool(manageContent);
    req.body.manageServer = toBool(manageServer);
    if (isValidObjectId(id)) {
        req.userId = id;
    }

    next();
};
module.exports.create = async (req, res, next) => {
    const userData = req.body;

    if (!userData.username) return next(new HttpError(400, 'Username is required'));
    if (!userData.password) return next(new HttpError(400, 'Password is required'));
    if (await User.exists({ username: userData.username })) return next(new HttpError(400, 'User already exists'));
    if (userData.password?.length < 8) return next(new HttpError(400, 'Minimum password length is 8 characters'));

    const user = await User.create(userData);

    res.status(201).json({
        user: {
            _id: user._id,
            username: user.username,
            manageUser: user.manageUser,
            manageContent: user.manageContent,
            manageServer: user.manageServer,
        },
    });
};
module.exports.update = async (req, res, next) => {
    const userId = req.userId;
    const userData = req.body;

    if (userData.password?.length < 8) return next(new HttpError(400, 'Minimum password length is 8 characters'));

    const user = await User.findByIdAndUpdate(userId, userData, { new: true });
    if (!user) return next(new HttpError(404, 'User not found'));

    res.status(200).json({
        user: {
            _id: user._id,
            username: user.username,
            manageUser: user.manageUser,
            manageContent: user.manageContent,
            manageServer: user.manageServer,
        },
    });
};
module.exports.delete = async (req, res, next) => {
    const userId = req.userId;

    const user = await User.findByIdAndDelete(userId);
    if (!user) return next(new HttpError(404, 'User not found'));

    res.status(204).send();
};
