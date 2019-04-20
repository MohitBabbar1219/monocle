const router = require('express').Router();

router.post('/test_route', (req, res) => {
    res.json({message: `Hello ${req.body.name}`});
});

module.exports = router;