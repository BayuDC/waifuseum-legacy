const router = require('express').Router();
const uploadImg = require('../middlewares/upload-img');
const sanitizeData = require('../middlewares/sanitize-data');
const HttpError = require('../lib/http-error');

router.get('/', (req, res) => {});
router.post('/:category?', uploadImg(), sanitizeData(), async (req, res, next) => {
    const { waifuseum, data } = res.locals;

    if (!waifuseum) return next(new HttpError(404, 'Category not found'));
    if (!data.file) return next(new HttpError(418, 'Picture file is required'));

    const picture = await waifuseum.create(data);

    data.file.destroy();
    res.status(201).json({ picture });
});
router.put('/', (req, res) => {});
router.delete('/', (req, res) => {});

module.exports = router;
