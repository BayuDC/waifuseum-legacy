const router = require('express').Router();
const museum = require('../controllers/museum');

router.use('/museum', museum.sanitize);

router.get('/museum/:category?', museum.find);
// router.get('/museum/pic/:id', museum.findById);
// router.get('/museum/pic/v/:id');
// router.get('/museum/pic/d/:id');

module.exports = router;
