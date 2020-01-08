var express = require('express');
var router = express.Router();

const httpPort = process.env.PORT || 3000;
const apiURL = `http://localhost:${httpPort}/api`

const bcryptjs = require('bcryptjs');
const fetch = require('node-fetch');

const authenticateToken = require('../authorization-module');

router.get('/', authenticateToken, function (req, res, next) {
  let user = req.user || {};
  if (req.user == undefined) {
    user.status = 'offline'
  } else {
    user.status = 'online'
  }

  res.render('createAccount', {
    user: user
  });
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

    /* Check if user already exists */
    let checkUser = await fetch(`${apiURL}/getUser/${req.body.usernameInput}/${req.body.emailInput}`)
      .then(response => response.json());

    if (checkUser.exists === true) {
      console.log('Username or email already in use')
      return res.redirect('/createAccount');
    };

    /* Create user */
    await fetch(`${apiURL}/createAccount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    }).then(response => response.json()).then(data => {
      console.log('Account created');
    });

    res.redirect('/createAccount');
  } catch {
    res.status(500).send();
  }
});

module.exports = router;
