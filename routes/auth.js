const router = require('express').Router();
const auth = require('../controllers/auth');

router.post('/auth/login', auth.login);
router.delete('/auth/logout', auth.logout);

module.exports = router;
