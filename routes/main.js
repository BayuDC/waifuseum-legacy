const router = require('express').Router();
const uploadImg = require('../middlewares/upload-img');
const HttpError = require('../lib/http-error');
const Waifuseum = require('../lib/waifuseum');

router.get('/', (req, res) => {});
router.post('/:category?', uploadImg(), async (req, res, next) => {
    const category = req.params.category ?? req.query.category ?? req.body.category;
    const sauce = req.query.sauce ?? req.body.sauce;
    const file = req.file;

    const waifuseum = Waifuseum(category, req.app.waifuseum.get(category));

    if (!waifuseum) return next(new HttpError(404, 'Category not found'));
    if (!file) return next(new HttpError(418, 'Picture file is required'));

    const picture = await waifuseum.create({ file, sauce });

    file.destroy();
    res.status(201).json({ picture });
});
router.put('/', (req, res) => {});
router.delete('/', (req, res) => {});

module.exports = router;
