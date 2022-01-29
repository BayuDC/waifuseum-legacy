const fs = require('fs/promises');
const multer = require('multer');
const HttpError = require('../lib/http-error');

module.exports = () => {
    const imgSize = 8 * 1024 * 1024;
    const imgFormats = { 'image/jpeg': 'jpg', 'image/png': 'png' };

    return (req, res, next) => {
        multer({
            dest: './temp/',
            limits: { fileSize: imgSize },
            fileFilter(req, file, cb) {
                if (!imgFormats[file.mimetype]) {
                    return cb(new multer.MulterError('NOT_AN_IMAGE'), false);
                }

                cb(null, true);
            },
        }).single('picture')(req, res, err => {
            if (err) {
                if (err.code == 'LIMIT_FILE_SIZE') return next(new HttpError(413, err.message));
                if (err.code == 'NOT_AN_IMAGE') return next(new HttpError(415, 'File is not an image'));
                return next(new HttpError(422));
            }
            if (!req.file) return next();

            const file = req.file;
            const filePath = `./temp/${file.filename}.${imgFormats[file.mimetype]}`;

            fs.rename(file.path, filePath).then(() => {
                file.path = filePath;
                file.destroy = () => {
                    fs.unlink(file.path);
                    file.destroy = () => {};
                };
                next();
            });
        });
    };
};
