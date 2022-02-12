const { isValidObjectId } = require('mongoose');
const Picture = require('../models/picture');
const HttpError = require('../lib/http-error');

module.exports.sanitize = [
    (req, res, next) => {
        const category = req.params.category || req.body.category;
        const picture = req.file;

        req.body.category = req.app.waifuseum.has(category) ? category : undefined;
        req.body.picture = picture;
        next();
    },
    async (req, res, next) => {
        let id = req.params.id || req.body.id;

        if (!id || !isValidObjectId(id)) return next();

        req.picture = (await Picture.findById(id)) ?? undefined;

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

    if (!category) return next(new HttpError(404, 'Category not found'));
    if (!pictureFile) return next(new HttpError(418, 'Picture file is required'));

    try {
        const picture = await Picture.createAndUpload(req.app.waifuseum.get(category), {
            category,
            pictureFile,
            sauce,
        });

        res.status(201).json({ picture });
    } catch (err) {
        if (err.name == 'AbortError') err = new HttpError(504, 'Upload failed due to slow connection');

        next(err);
    }

    pictureFile.destroy();
};

module.exports.update = async (req, res, next) => {
    const { category, picture: pictureFile, sauce } = req.body;
    let picture = req.picture;

    if (!picture) return next(new HttpError(404, 'Picture not found'));

    try {
        const channel = req.app.waifuseum.get(picture.category);
        const message = await channel.messages.fetch(picture.messageId);

        if (category) {
            picture = await picture.updateCategory(message, req.app.waifuseum.get(category), {
                category,
                pictureFile,
                sauce,
            });
        } else if (pictureFile) {
            picture = await picture.updateFile(message, { pictureFile, sauce });
        } else {
            picture = await picture.update({ sauce });
        }

        res.json({ picture });
    } catch (err) {
        if (err.name == 'AbortError') err = new HttpError(504, 'Upload failed due to slow connection');
        if (err.name == 'DiscordAPIError' && err.message == 'Unknown Message') err = new HttpError(404, 'Picture not found');

        next(err);
    }

    pictureFile?.destroy();
};
