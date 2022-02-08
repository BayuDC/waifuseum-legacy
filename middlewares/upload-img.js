const { promises: fs, createWriteStream } = require('fs');
const { randomBytes } = require('crypto');
const { isWebUri } = require('valid-url');
const multer = require('multer');
const axios = require('axios').default;
const HttpError = require('../lib/http-error');

const imgSize = 8 * 1024 * 1024;
const imgFormats = { 'image/jpeg': 'jpg', 'image/png': 'png' };

const downloadImg = url => {
    return new Promise((resolve, reject) => {
        axios.get(url, { responseType: 'stream' }).then(res => {
            const fileName = randomBytes(16).toString('hex');
            const filePath = './temp/' + fileName;
            const writer = createWriteStream(filePath);
            res.data.pipe(writer);
            res.data.on('end', () => {
                resolve({
                    filename: fileName,
                    path: filePath,
                    mimetype: res.headers['content-type'],
                });
            });
        });
    });
};

module.exports = () => {
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
        }).single('picture')(req, res, async err => {
            if (err) {
                if (err.code == 'LIMIT_FILE_SIZE') return next(new HttpError(413, err.message));
                if (err.code == 'NOT_AN_IMAGE') return next(new HttpError(415, 'File is not an image'));
                return next(new HttpError(422));
            }

            if (!req.file && isWebUri(req.body.picture)) {
                req.file = await downloadImg(req.body.picture);
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
