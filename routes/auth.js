const router = require('express').Router();
const auth = require('../controllers/auth');

router.get('/auth', auth.status);
router.post('/auth/login', auth.login);
router.delete('/auth/logout', auth.logout);

module.exports = router;
