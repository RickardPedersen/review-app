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
        responseObject.username = result[0].username;
        responseObject.email = result[0].email;
        responseObject.password = result[0].password;
        responseObject.roll = result[0].roll;
        res.status(200).send(responseObject);
    });
    
});

/* Check if restaurant already exists */
router.get('/checkRestaurant/:name', function (req, res, next) {
    let db = req.db
    
    let responseObject = {
        response: "OK",
        exists: false
    }

    let sql = `SELECT * FROM restaurants WHERE name = '${req.params.name}'`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) responseObject.exists = true;
        res.status(200).send(responseObject);
    });
});

router.post('/addRestaurant', (req, res, next) => {
    let db = req.db

    let responseObject = {
        response: "Created",
    }

    let post = {
        name: req.body.name,
        genre: req.body.genre,
        location: req.body.location
    }

    let sql = 'INSERT INTO restaurants SET ?';

    db.query(sql, post, (err, result) => {
        if (err) throw err;
        console.log(result)
        res.status(201).send(responseObject);
    });
});

router.get('/getAllRestaurants', (req, res, next) => {
    let db = req.db
    
    let responseObject = {
        response: "OK"
    }

    let sql = 'SELECT * FROM restaurants';

    db.query(sql, (err, result) => {
        if (err) throw err;
        responseObject.data = result;
        res.status(200).send(responseObject);
    });
});

router.get('/getRestaurant/:name', (req, res, next) => {
    let db = req.db
    
    let responseObject = {
        response: "OK"
    }

    let sql = `SELECT * FROM restaurants WHERE name = '${req.params.name}'`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        responseObject.data = result;
        res.status(200).send(responseObject);
    });
});

router.delete('/deleteRestaurant', (req, res, next) => {
    let db = req.db
    
    let responseObject = {
        response: "OK"
    }

    let sql = `DELETE FROM restaurants WHERE name = '${req.body.name}'`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        //responseObject.data = result;
        res.status(200).send(responseObject);
    });
});

router.put('/editRestaurant', (req, res, next) => {
    let db = req.db
    
    let responseObject = {
        response: "OK"
    }

    let sql = `UPDATE restaurants
               SET name = '${req.body.newName}', genre = '${req.body.newGenre}', location = '${req.body.newLocation}'
               WHERE name = '${req.body.oldName}'`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        //responseObject.data = result;
        res.status(200).send(responseObject);
    });
});

module.exports = router;
