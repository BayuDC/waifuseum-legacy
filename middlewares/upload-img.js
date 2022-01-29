const fs = require('fs/promises');
const multer = require('multer');

module.exports = () => {
    const imgSize = 8 * 1024 * 1024;
    const imgFormats = { 'image/jpeg': 'jpg', 'image/png': 'png' };

    return (req, res, next) => {
        multer({
            dest: './temp/',
            limits: { fileSize: imgSize },
        }).single('picture')(req, res, err => {
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
