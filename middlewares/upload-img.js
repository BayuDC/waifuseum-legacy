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
        axios
            .get(url, { responseType: 'stream' })
            .then(res => {
                const file = {
                    name: randomBytes(16).toString('hex'),
                    path: './temp/' + this.name,
                    type: res.headers['content-type'],
                    size: res.headers['content-length'],
                };

                if (!imgFormats[file.type]) throw { code: 'NOT_AN_IMAGE' };
                if (file.size > imgSize) throw { code: 'LIMIT_FILE_SIZE' };

                res.data.pipe(createWriteStream(file.path));
                res.data.on('end', () => {
                    resolve({
                        path: file.path,
                        filename: file.name,
                        mimetype: file.type,
                    });
                });
            })
            .catch(reject);
    });
};
const handleErr = (err, next) => {
    if (err.code == 'LIMIT_FILE_SIZE') return next(new HttpError(413, err.message));
    if (err.code == 'NOT_AN_IMAGE') return next(new HttpError(415, 'File is not an image'));
    next(new HttpError(422, 'Unprocessable file'));
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
            if (err) return handleErr(err, next);

            if (!req.file && isWebUri(req.body.picture)) {
                try {
                    req.file = await downloadImg(req.body.picture);
                } catch (err) {
                    return handleErr(err, next);
                }
            }
            if (!req.file) return next();

            const file = req.file;
            const filePath = `./temp/${file.filename}.${imgFormats[file.mimetype]}`;

            await fs.rename(file.path, filePath);
            file.path = filePath;
            file.destroy = () => {
                fs.unlink(file.path);
                file.destroy = () => {};
            };
            next();
        });
    };
};
