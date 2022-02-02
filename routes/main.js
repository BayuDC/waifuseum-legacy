const router = require('express').Router();
const uploadImg = require('../middlewares/upload-img');
const sanitizeData = require('../middlewares/sanitize-data');
const HttpError = require('../lib/http-error');

router.get('/', (req, res) => {});
router.post('/:category?', uploadImg(), sanitizeData(), async (req, res, next) => {
    const { waifuseum, data } = res.locals;

    if (!waifuseum) return next(new HttpError(404, 'Category not found'));
    if (!data.file) return next(new HttpError(418, 'Picture file is required'));

    const { err, picture } = await waifuseum.create(data);

    if (err) return next(err);
    res.status(201).json({ picture });
});
router.put('/:id?', uploadImg(), sanitizeData(), async (req, res, next) => {
    const { picture: pictureOld, waifuseum, data } = res.locals;

    if (!pictureOld) return next(new HttpError(404, 'Picture not found'));
    if (!waifuseum || (data.category?.name && !data.category.channel)) {
        return next(new HttpError(404, 'Category not found'));
    }

    const { err, picture } = await waifuseum.update(pictureOld, data);

    if (err) return next(err);
    res.status(200).json({ picture });
});
router.delete('/', (req, res) => {});

module.exports = router;
