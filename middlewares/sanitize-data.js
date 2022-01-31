const Waifuseum = require('../lib/waifuseum');
const Picture = require('../models/picture');

module.exports = () => {
    return async (req, res, next) => {
        const id = req.params.id ?? req.query.id ?? req.body.id;
        const picture = !id || (await Picture.findById(id));

        const category = req.params.category ?? req.query.category ?? req.body.category ?? picture.category;
        const sauce = req.query.sauce ?? req.body.sauce;
        const file = req.file;

        const waifuseum = Waifuseum(category, req.app.waifuseum.get(category));

        res.locals.waifuseum = waifuseum;
        res.locals.picture = picture;
        res.locals.data = {
            id,
            category,
            sauce,
            file,
        };
        next();
    };
};
