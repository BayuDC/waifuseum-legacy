const mongoose = require('mongoose');
const Waifuseum = require('../lib/waifuseum');
const Picture = require('../models/picture');

module.exports = () => {
    return [
        (req, res, next) => {
            const category = req.params.category ?? req.body.category;
            const sauce = req.body.sauce;
            const file = req.file;

            res.locals.data = { category, sauce, file };
            next();
        },
        async (req, res, next) => {
            const id = req.params.id ?? req.body.id;
            if (!mongoose.isValidObjectId(id)) id = undefined;

            const picture = await Picture.findById(id);

            res.locals.picture = picture;
            next();
        },
        (req, res, next) => {
            const category = res.locals.picture?.category ?? res.locals.data.category;
            const waifuseum = Waifuseum(category, req.app.waifuseum.get(category));

            res.locals.waifuseum = waifuseum;
            next();
        },
        (req, res, next) => {
            const picture = res.locals.picture;
            const category = res.locals.data.category;
            const channel = req.app.waifuseum.get(category);

            if (picture && category && picture != category) {
                res.locals.data.category = { name: category, channel };
                return next();
            }
            res.locals.data.category = undefined;
            next();
        },
    ];
};
