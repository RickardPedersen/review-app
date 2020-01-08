var express = require('express');
var router = express.Router();

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const authenticateToken = require('../authorization-module');

router.get('/', authenticateToken, async function (req, res, next) {
    let user = {}
    if (req.user == undefined) {
        user.status = 'offline'
    } else {
        user.status = 'online'
        user.username = req.user.username
    }
    console.log(user)

    let restaurants = await fetch(`http://localhost:3000/api/getAllRestaurants`)
        .then(response => response.json());
    res.render('restaurants', {
        user: user,
        restaurants: restaurants.data
    });
});

router.get('/restaurant/:name', authenticateToken, async function (req, res, next) {
    let user = {}
    if (req.user == undefined) {
        user.status = 'offline'
    } else {
        user.status = 'online'
        user.username = req.user.username
    }
    console.log(user)

    let restaurant = await fetch(`http://localhost:3000/api/getRestaurant/${req.params.name}`)
        .then(response => response.json());

    let reviews = await fetch(`http://localhost:3000/api/getReviews/${restaurant.data[0].restaurantID}`)
    .then(response => response.json());
    console.log(reviews)

        //console.log(restaurant)
    res.render('restaurant', {
        user: user,
        restaurant: restaurant.data[0],
        reviews: reviews.data
    });
});

router.get('/addRestaurants', authenticateToken, function (req, res, next) {
    console.log(req.user)
    let user = {}
    if (req.user == undefined) {
        user.status = 'offline'
    } else {
        user.status = 'online'
        user.username = req.user.username
    }
    res.render('addRestaurants', {
        user: user
    });
});

router.post('/addRestaurants', async function (req, res, next) {

    let checkRestaurant = await fetch(`http://localhost:3000/api/checkRestaurant/${req.body.nameInput}`)
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

    await fetch('http://localhost:3000/api/addRestaurant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(restaurant)
    }).then(response => response.json()).then(data => {
        console.log(data)
        console.log('Account created');
    });

    console.log('LEDIG')
    return res.redirect('/restaurants/addRestaurants');

});

router.get('/delete/:name', async (req, res, next) =>{
    await fetch(`http://localhost:3000/api/deleteRestaurant`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: req.params.name})
    }).then(response => response.json()).then(data => {
        console.log(data)
        console.log('Restaurant deleted');
        res.redirect('/restaurants');
    });
});

router.get('/edit/:name', async (req, res, next) =>{
    let user = {}
    if (req.user == undefined) {
        user.status = 'offline'
    } else {
        user.status = 'online'
        user.username = req.user.username
    }
    console.log(user)

    let restaurant = await fetch(`http://localhost:3000/api/getRestaurant/${req.params.name}`)
        .then(response => response.json());
        console.log(restaurant)
    res.render('editRestaurant', {
        user: user,
        restaurant: restaurant.data[0]
    });
});


router.post('/edit/:oldName', async (req, res, next) =>{
    console.log(req.params.oldName)
    console.log(req.body.nameInput)
    console.log(req.body.genreInput)
    console.log(req.body.locationInput)
    //res.redirect('/restaurants')

    let checkRestaurant = await fetch(`http://localhost:3000/api/checkRestaurant/${req.body.nameInput}`)
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

    
    await fetch(`http://localhost:3000/api/editRestaurant`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(restaurant)
    }).then(response => response.json()).then(data => {
        console.log(data)
        console.log('Restaurant updated');
        res.redirect('/restaurants');
    });
    
   //res.redirect('/restaurants');
});

router.get('/review', async (req, res, next) => {
    let user = {}
    if (req.user == undefined) {
        user.status = 'offline'
    } else {
        user.status = 'online'
        user.username = req.user.username
    }

    let restaurants = await fetch(`http://localhost:3000/api/getAllRestaurants`)
        .then(response => response.json());
    res.render('review', {
        user: user,
        restaurants: restaurants.data
    });
});

router.post('/review', async function (req, res, next) {
    

    
    let review = {
        username: 'test',
        restaurantID: req.body.restaurantInput,
        rating: req.body.ratingInput,
        message: req.body.messageInput
    }
    //console.log(review)

    await fetch('http://localhost:3000/api/addReview', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(review)
    }).then(response => response.json()).then(data => {
        console.log(data)
        console.log('Review created');
    });

    //return res.redirect('/restaurants/addRestaurants');
    
   res.redirect('/restaurants/review');
});

module.exports = router;