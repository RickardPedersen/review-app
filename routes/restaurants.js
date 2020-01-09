var express = require('express');
var router = express.Router();

const fetch = require('node-fetch');

const httpPort = process.env.PORT || 3000;
const apiURL = `http://localhost:${httpPort}/api`

const authenticateToken = require('../authorization-module');

router.get('/', authenticateToken, async function (req, res, next) {
    let user = req.user || {};
    if (req.user == undefined) {
        user.status = 'offline'
    } else {
        user.status = 'online'
    }

    let restaurants = await fetch(`${apiURL}/getRestaurants`)
        .then(response => response.json());

    let genres = await fetch(`${apiURL}/getGenres`)
        .then(response => response.json());

    res.render('restaurants', {
        user: user,
        restaurants: restaurants.data,
        genres: genres.data,
        title: 'Topplista'
    });
});

router.post('/genres', (req, res, next) => {
    res.redirect(`/restaurants/genres/${req.body.genreInput}`);
})

router.get('/genres/:genre', authenticateToken, async (req, res, next) => {
    let user = req.user || {};
    if (req.user == undefined) {
        user.status = 'offline'
    } else {
        user.status = 'online'
    }

    let restaurants = await fetch(`${apiURL}/getRestaurantsByGenre/${req.params.genre}`)
        .then(response => response.json());

    let genres = await fetch(`${apiURL}/getGenres`)
        .then(response => response.json());

    res.render('restaurants', {
        user: user,
        restaurants: restaurants.data,
        genres: genres.data,
        title: req.params.genre
    });
});

router.get('/restaurant/:name', authenticateToken, async function (req, res, next) {
    let user = req.user || {};
    if (req.user == undefined) {
        user.status = 'offline'
    } else {
        user.status = 'online'
    }

    let restaurant = await fetch(`${apiURL}/getRestaurant/${req.params.name}`)
        .then(response => response.json());

    let reviews = await fetch(`${apiURL}/getReviews/${restaurant.data[0].restaurantID}`)
        .then(response => response.json());

    res.render('restaurant', {
        user: user,
        restaurant: restaurant.data[0],
        reviews: reviews.data
    });
});

router.get('/addRestaurants', authenticateToken, async function (req, res, next) {
    let user = req.user || {};
    if (req.user == undefined) {
        user.status = 'offline'
    } else {
        user.status = 'online'
    }

    if (user.roll != 'admin') return res.redirect('/');

    let genres = await fetch(`${apiURL}/getGenres`)
        .then(response => response.json());

    res.render('addRestaurants', {
        user: user,
        genres: genres.data
    });
});

router.post('/addRestaurants', async function (req, res, next) {

    let checkRestaurant = await fetch(`${apiURL}/checkRestaurant/${req.body.nameInput}`)
        .then(response => response.json());

    if (checkRestaurant.exists === true) {
        console.log('Restaurant already exists')
        return res.redirect('/restaurants/addRestaurants');
    }

    let restaurant = {
        name: req.body.nameInput,
        genre: req.body.genreInput,
        location: req.body.locationInput
    }

    await fetch(`${apiURL}/addRestaurant`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(restaurant)
    }).then(response => response.json()).then(data => {
        console.log('Restaurant created');
    });

    return res.redirect('/restaurants');
});

router.get('/delete/:name', authenticateToken, async (req, res, next) => {
    let user = req.user || {};
    if (req.user == undefined) {
        user.status = 'offline'
    } else {
        user.status = 'online'
    }

    if (user.roll !== 'admin') return res.redirect('/');

    await fetch(`${apiURL}/deleteRestaurant`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: req.params.name
        })
    }).then(response => response.json()).then(data => {
        console.log('Restaurant deleted');
        res.redirect('/restaurants');
    });
});

router.get('/edit/:name', authenticateToken, async (req, res, next) => {
    let user = req.user || {};
    if (req.user == undefined) {
        user.status = 'offline'
    } else {
        user.status = 'online'
    }
    if (user.roll != 'admin') return res.redirect('/');

    let restaurant = await fetch(`${apiURL}/getRestaurant/${req.params.name}`)
        .then(response => response.json());

    let genres = await fetch(`${apiURL}/getGenres`)
        .then(response => response.json());

    res.render('editRestaurant', {
        user: user,
        restaurant: restaurant.data[0],
        genres: genres.data
    });
});


router.post('/edit/:oldName', async (req, res, next) => {
    let checkRestaurant = await fetch(`${apiURL}/checkRestaurant/${req.body.nameInput}`)
        .then(response => response.json());

    if (checkRestaurant.exists === true && req.params.oldName !== req.body.nameInput) {
        console.log('Restaurant already exists')
        return res.redirect('/restaurants');
    }
    console.log('DOES NOT EXIST')

    let restaurant = {
        oldName: req.params.oldName,
        newName: req.body.nameInput,
        newGenre: req.body.genreInput,
        newLocation: req.body.locationInput
    }


    await fetch(`${apiURL}/editRestaurant`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(restaurant)
    }).then(response => response.json()).then(data => {
        console.log('Restaurant updated');
        res.redirect('/restaurants');
    });
});

router.get('/review', authenticateToken, async (req, res, next) => {
    let user = req.user || {};
    if (req.user == undefined) {
        user.status = 'offline'
    } else {
        user.status = 'online'
    }
    if (user.status != 'online') return res.redirect('/login');

    let restaurants = await fetch(`${apiURL}/getRestaurants`)
        .then(response => response.json());
    res.render('review', {
        user: user,
        restaurants: restaurants.data
    });
});

router.post('/review', authenticateToken, async function (req, res, next) {
    let user = req.user || {};
    if (req.user == undefined) {
        user.status = 'offline'
    } else {
        user.status = 'online'
    }
    if (user.status != 'online') return res.redirect('/login');

    let review = {
        username: user.username,
        restaurantID: req.body.restaurantInput,
        rating: req.body.ratingInput,
        message: req.body.messageInput
    }

    await fetch(`${apiURL}/addReview`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(review)
    }).then(response => response.json()).then(data => {
        console.log('Review created');
    });

    res.redirect('/restaurants');
});

module.exports = router;
