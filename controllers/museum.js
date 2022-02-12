const Picture = require('../models/picture');
const HttpError = require('../lib/http-error');

module.exports.sanitize = [
    (req, res, next) => {
        const category = req.params.category || req.body.category;
        const picture = req.file;

        req.body.category = req.app.waifuseum.has(category) ? category : undefined;
        req.body.picture = picture;
        req.waifuseum = req.app.waifuseum.get(category);
        next();
    },
];
module.exports.find = async (req, res, next) => {
    const { category } = req.body;
    const count = parseInt(req.query.n);

    if (!category) return next(new HttpError(404, 'Category not found'));

    const pictures = await Picture.findRandom(category, count);

    if (!pictures.length) return next(new HttpError(404, 'No picture found'));

    if (!count) return res.json({ picture: pictures[0] });
    res.json({ pictures });
};
module.exports.create = async (req, res, next) => {
    const { category, picture: pictureFile, sauce } = req.body;
    const waifuseum = req.waifuseum;

    if (!category || !waifuseum) return next(new HttpError(404, 'Category not found'));
    if (!pictureFile) return next(new HttpError(418, 'Picture file is required'));

    try {
        const picture = await Picture.createAndUpload(waifuseum, { category, pictureFile, sauce });

        res.status(201).json({ picture });
    } catch (err) {
        if (err.name == 'AbortError') return next(new HttpError(504, 'Upload failed due to slow connection'));

        next(err);
    } finally {
        pictureFile.destroy();
    }
};
