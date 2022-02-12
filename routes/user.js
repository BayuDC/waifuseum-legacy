const router = require('express').Router();
const user = require('../controllers/user');
const needPermission = require('../middlewares/need-permission');

router.all('/user/:id?', needPermission('manageUser'), user.sanitize);

router.post('/user', user.create);
router.put('/user/:id?', user.update);
router.delete('/user/:id?', user.delete);

module.exports = router;
