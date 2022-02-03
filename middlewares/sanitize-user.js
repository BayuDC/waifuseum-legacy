module.exports = () => {
    return (req, res, next) => {
        const { username, password, manageUser, manageContent } = req.body;
        res.locals.data = {
            username,
            password,
            manageUser: manageUser == 'true' || undefined,
            manageContent: manageContent == 'true' || undefined,
        };
        next();
    };
};
