var express = require('express');
var router = express.Router();

/* GET api */
router.get('/', function (req, res, next) {
    res.send('api here...');
});

/* Check if user already exists */
router.get('/getUser/:username/:email', function (req, res, next) {
    let db = req.db
    
    let responseObject = {
        response: "OK",
        exists: false
    }

    let sql = `SELECT * FROM users WHERE username = '${req.params.username}' OR email = '${req.params.email}'`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) responseObject.exists = true;
        res.status(200).send(responseObject);
    });
});


/* POST (create) account */
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

/* Log in user */
router.get('/login/:email', function (req, res, next) {
    let db = req.db
    
    let responseObject = {
        response: "OK"
    }

    let sql = `SELECT * FROM users WHERE email = '${req.params.email}'`;
    
    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length < 1) {
            responseObject.response = 'Not Found';
            return res.status(404).send(responseObject)
        };
        responseObject.password = result[0].password;
        res.status(200).send(responseObject);
    });
    
});

module.exports = router;
