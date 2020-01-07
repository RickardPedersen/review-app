var express = require('express');
var router = express.Router();

/* GET api */
router.get('/', function (req, res, next) {
    res.send('api here...');
});


/* Create account */
router.post('/createAccount', function (req, res, next) {
    let db = req.db

    let responseObject = {
        response: "Created",
    }

    let post = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        roll: req.body.roll
    }

    let sql = 'INSERT INTO users SET ?';
    db.query(sql, post, (err, result) => {
        if (err) throw err;
        console.log(result)
        res.status(201).send(responseObject);
    });
});

module.exports = router;
