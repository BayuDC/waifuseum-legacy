const { isValidObjectId } = require('mongoose');

const toBool = value => {
    if (value == 'true') return true;
    if (value == 'false') return false;

    return undefined;
};

module.exports = () => {
    return [
        (req, res, next) => {
            const { username, password, manageUser, manageContent } = req.body;
            res.locals.data = {
                username,
                password,
                manageUser: toBool(manageUser),
                manageContent: toBool(manageContent),
            };
            next();
        },
        (req, res, next) => {
            const id = req.params.id || req.body.id;
            if (isValidObjectId(id)) {
                res.locals.userId = id;
            }

            next();
        },
    ];
};
