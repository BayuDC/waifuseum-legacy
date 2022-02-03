const router = require('express').Router();
const User = require('../models/user');
const needPermission = require('../middlewares/need-permission');
const sanitizeUser = require('../middlewares/sanitize-user');

router.all('/user', needPermission('manageUser'), sanitizeUser());

router.post('/user', async (req, res) => {
    const { data } = res.locals;

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
router.put('/user', async (req, res) => {});
router.delete('/user', async (req, res) => {});

module.exports = router;
