var express = require('express');
var router = express.Router();

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const httpPort = process.env.PORT || 3000;
const apiURL = `http://localhost:${httpPort}/api`

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
  res.render('login', {
    user: user
  });
});

/* Log in user */
router.post('/', async (req, res, next) => {
  /* Check if email exists */
  let userData = await fetch(`${apiURL}/login/${req.body.emailInput}`)
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

      return res.redirect('/login');
    } else {
      console.log('Wrong password');
      return res.redirect('/login');
    }
  } catch {
    return res.status(500).send();
  }
});

module.exports = router;
