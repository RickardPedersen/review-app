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


module.exports = router;