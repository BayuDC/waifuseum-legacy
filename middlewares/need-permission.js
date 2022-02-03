module.exports = permission => {
    return (req, res, next) => {
        const user = res.locals.user;

        if (!user || !user[permission]) {
            return res.status(401).send();
        }

        next();
    };
};
