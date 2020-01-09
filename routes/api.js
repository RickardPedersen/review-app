var express = require('express');
var router = express.Router();

/* GET: check if username or email already exists in database */
router.get('/getUser/:username/:email', (req, res) => {
    let db = req.db

    let responseObject = {
        response: "OK",
        exists: false
    }

    let sql = `SELECT * FROM users WHERE username = ${db.escape(req.params.username)} OR email = ${db.escape(req.params.email)}`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) responseObject.exists = true;
        res.status(200).send(responseObject);
    });
});

/* POST: create account */
router.post('/createAccount', (req, res) => {
    let db = req.db;

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
        res.status(201).send(responseObject);
    });
});

/* GET: log in user */
router.get('/login/:email', function (req, res) {
    let db = req.db

    let responseObject = {
        response: "OK"
    }

    let sql = `SELECT * FROM users WHERE email = ${db.escape(req.params.email)}`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length < 1) {
            responseObject.response = 'Not Found';
            return res.status(404).send(responseObject)
        };

        /* Send back user data */
        responseObject.username = result[0].username;
        responseObject.email = result[0].email;
        responseObject.password = result[0].password;
        responseObject.roll = result[0].roll;
        res.status(200).send(responseObject);
    });
});

/* GET: check if restaurant already exists in database */
router.get('/checkRestaurant/:name', (req, res) => {
    let db = req.db

    let responseObject = {
        response: "OK",
        exists: false
    }

    let sql = `SELECT * FROM restaurants WHERE name = ${db.escape(req.params.name)}`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) responseObject.exists = true;
        res.status(200).send(responseObject);
    });
});

/* POST: add restaurant to database */
router.post('/addRestaurant', (req, res) => {
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
        res.status(201).send(responseObject);
    });
});

/* GET all restaurants */
router.get('/getAllRestaurants', (req, res) => {
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

/* GET: get ten highest rated restaurants */
router.get('/getRestaurants', (req, res) => {
    let db = req.db

    let responseObject = {
        response: "OK"
    }

    /* Aggregate function that calculate restaurants avrage rating */
    let sql = `SELECT *,
        (SELECT ROUND(AVG(rating), 1)
        FROM reviews
        WHERE reviews.restaurantID = restaurants.restaurantID) AS avgRating
        FROM restaurants
        ORDER BY avgRating desc
        LIMIT 10`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        responseObject.data = result;
        res.status(200).send(responseObject);
    });
});

/* GET: gets all restaurants by specific genre */
router.get('/getRestaurantsByGenre/:genre', (req, res) => {
    let db = req.db

    let responseObject = {
        response: "OK"
    }

    /* Aggregate function that calculate restaurants avrage rating */
    let sql = `SELECT *,
        (SELECT ROUND(AVG(rating), 1)
        FROM reviews
        WHERE reviews.restaurantID = restaurants.restaurantID) AS avgRating
        FROM restaurants
        WHERE genre = ${db.escape(req.params.genre)}
        ORDER BY avgRating desc`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        responseObject.data = result;
        res.status(200).send(responseObject);
    });
});

/* GET: get specific restaurant */
router.get('/getRestaurant/:name', (req, res) => {
    let db = req.db

    let responseObject = {
        response: "OK"
    }

    /* Aggregate function that calculate restaurants avrage rating */
    let sql = `SELECT *, 
               (SELECT ROUND(AVG(rating), 1) FROM reviews 
               WHERE reviews.restaurantID = restaurants.restaurantID) AS avgRating
               FROM restaurants
               WHERE name = ${db.escape(req.params.name)}`

    db.query(sql, (err, result) => {
        if (err) throw err;
        responseObject.data = result;
        res.status(200).send(responseObject);
    });
});

/* DELETE: deletes a restaurant */
router.delete('/deleteRestaurant', (req, res) => {
    let db = req.db

    let responseObject = {
        response: "OK"
    }

    let sql = `DELETE FROM restaurants WHERE name = ${db.escape(req.body.name)}`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        res.status(200).send(responseObject);
    });
});

/* PUT: edits a restaurant */
router.put('/editRestaurant', (req, res) => {
    let db = req.db

    let responseObject = {
        response: "OK"
    }

    let sql = `UPDATE restaurants
               SET name = ${db.escape(req.body.newName)},
               genre = ${db.escape(req.body.newGenre)},
               location = ${db.escape(req.body.newLocation)}
               WHERE name = ${db.escape(req.body.oldName)}`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        res.status(200).send(responseObject);
    });
});

/* GET: gets reviews for specific restaurant */
router.get('/getReviews/:restaurantID', (req, res) => {
    let db = req.db

    let responseObject = {
        response: "OK"
    }

    let sql = `SELECT * FROM reviews WHERE restaurantID = ${db.escape(req.params.restaurantID)}`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        responseObject.data = result;
        res.status(200).send(responseObject);
    });
});

/* POST: add review to database */
router.post('/addReview', (req, res) => {
    let db = req.db

    let responseObject = {
        response: "Created",
    }

    let post = {
        username: req.body.username,
        restaurantID: req.body.restaurantID,
        rating: req.body.rating,
        message: req.body.message
    }

    let sql = 'INSERT INTO reviews SET ?';

    db.query(sql, post, (err, result) => {
        if (err) throw err;
        res.status(201).send(responseObject);
    });
});

/* GET: get all genres from database */
router.get('/getGenres', (req, res) => {
    let db = req.db

    let responseObject = {
        response: "OK"
    }

    let sql = 'SELECT * FROM genres';

    db.query(sql, (err, result) => {
        if (err) throw err;
        responseObject.data = result;
        res.status(200).send(responseObject);
    });
});

module.exports = router;
