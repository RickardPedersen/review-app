var express = require('express');
var router = express.Router();

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const authenticateToken = require('../authorization-module');

router.get('/logout', (req, res) => {
  res.clearCookie('accessToken');
  return res.redirect('/');
});

/* GET login page. */
router.get('/', authenticateToken, function (req, res, next) {
  let user = req.user || {};
  if (req.user == undefined) {
    user.status = 'offline'
  } else {
    user.status = 'online'
  }
  console.log(user);
  res.render('login', {
    user: user
  });
});

/* Log in user */
router.post('/', async (req, res, next) => {


  /* Check if email exists */
  let userData = await fetch(`http://localhost:3000/api/login/${req.body.emailInput}`)
    .then(response => response.json());

  // userData.response == 'Not Found'
  if (userData.password === undefined) {
    console.log('cannot fint user');
    return res.redirect('/login');
  }

  try {
    /* Compare input password with database password */
    if (await bcryptjs.compare(req.body.passwordInput, userData.password)) {

      console.log('Success! Logging in...');


      const user = {
        username: userData.username,
        email: userData.email,
        roll: userData.roll
      }

      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '600s'
      });
      res.cookie('accessToken', accessToken, {
        maxAge: 600000,
        httpOnly: true
      });
      //next();
      return res.redirect('/login');
      

      
    } else {
      console.log('Wrong password');
      return res.redirect('/login');
    }
  } catch {
    return res.status(500).send();
  }
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