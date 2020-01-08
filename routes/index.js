var express = require('express');
var router = express.Router();

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const authenticateToken = require('../authorization-module');

/* GET home page. */
router.get('/', authenticateToken, function(req, res, next) {
  console.log(req.user)
  let user = {}
  if (req.user == undefined) {
    user.status = 'offline'
  } else {
    user.status = 'online'
    user.username = req.user.username
  }
  res.render('index', user);
});

/*
function authenticateToken(req, res, next) {
  const token = req.cookies.accessToken;
  if (token == null) {
    console.log('no token')
    next();
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log('invalid token')
        next();
      } else {
        console.log('YOU ARE AUTHORIZED')
        req.user = user;
        next();
      }
    });
  }
}
*/

module.exports = router;
