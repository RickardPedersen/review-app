var express = require('express');
var router = express.Router();

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const users = [];

router.get('/', authenticateToken, function (req, res, next) {
  let user = {}
  if (req.user == undefined) {
    user.status = 'offline'
  } else {
    user.status = 'online'
    user.username = req.user.username
  }
  console.log(user)
  res.render('createAccount', user);
});


/* POST (create) user */
router.post('/', async function (req, res, next) {
  try {
    const hashedPassword = await bcryptjs.hash(req.body.passwordInput, 10);
    const user = {
      username: req.body.usernameInput,
      email: req.body.emailInput,
      password: hashedPassword,
      roll: 'user'
    };
    users.push(user);

    /* Check if user already exists */
    let checkUser = await fetch(`http://localhost:3000/api/getUser/${req.body.usernameInput}/${req.body.emailInput}`)
    .then(response => response.json());

    if (checkUser.exists === true) {
      console.log('Username or email already in use')
      return res.redirect('/createAccount');
    };

    /* Create user */
    await fetch('http://localhost:3000/api/createAccount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    }).then(response => response.json()).then(data => {
      console.log(data)
      console.log('Account created');
    });

    res.redirect('/createAccount');
  } catch {
    res.status(500).send();
  }
});

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

module.exports = router;