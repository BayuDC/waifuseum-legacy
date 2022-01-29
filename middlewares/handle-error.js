const HttpError = require('../lib/http-error');

module.exports = () => {
    return (err, req, res, next) => {
        req.file?.destroy();
        if (!(err instanceof HttpError)) return res.sendStatus(404);

        res.status(err?.code ?? 500);
        res.send({ error: err?.message ?? 'Something went wrong' });
    };
};
