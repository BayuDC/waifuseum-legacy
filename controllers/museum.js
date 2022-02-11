const Picture = require('../models/picture');
const HttpError = require('../lib/http-error');

module.exports.sanitize = [
    (req, res, next) => {
        const category = req.params.category || req.body.category;

        req.body.category = req.app.waifuseum.has(category) ? category : undefined;
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
