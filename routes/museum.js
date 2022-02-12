const router = require('express').Router();
const museum = require('../controllers/museum');
const uploadImg = require('../middlewares/upload-img');
const needPermission = require('../middlewares/need-permission');

router.get('/museum/:category?', museum.sanitize, museum.find);
// router.get('/museum/pic/:id', museum.findById);
// router.get('/museum/pic/v/:id');
// router.get('/museum/pic/d/:id');

router.post('/museum:category?', uploadImg(), museum.sanitize, museum.create);

module.exports = router;
