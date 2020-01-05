var express = require('express');
var router = express.Router();

/* GET api */
router.get('/', function (req, res, next) {
    res.send('api here...');
});

router.get('/test', function (req, res, next) {
    res.send('test api here...');
});

module.exports = router;
