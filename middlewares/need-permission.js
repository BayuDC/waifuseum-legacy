module.exports = permission => {
    return (req, res, next) => {
        const user = req.user;

        if (!user || !user[permission]) {
            return res.status(401).send();
        }

        next();
    };
};
