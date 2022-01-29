const router = require('express').Router();

router.get('/', (req, res) => {});
router.post('/', (req, res) => {
    req.file?.destroy();
    res.send('ok');
});
router.put('/', (req, res) => {});
router.delete('/', (req, res) => {});

module.exports = router;
