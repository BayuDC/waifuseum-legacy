const Waifuseum = require('../lib/waifuseum');

module.exports = () => {
    return (req, res, next) => {
        const category = req.params.category ?? req.query.category ?? req.body.category;
        const sauce = req.query.sauce ?? req.body.sauce;
        const file = req.file;

        const waifuseum = Waifuseum(category, req.app.waifuseum.get(category));

        res.locals.waifuseum = waifuseum;
        res.locals.data = {
            category,
            sauce,
            file,
        };
        next();
    };
};
