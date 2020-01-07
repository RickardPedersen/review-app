var express = require('express');
var router = express.Router();

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('login');
});

router.post('/', async (req, res) => {

  /* Check if email exists */
  let userData = await fetch(`http://localhost:3000/api/login/${req.body.emailInput}`)
  .then(response => response.json());

  if (userData.password === undefined) {
    console.log('cannot fint user');
    return res.redirect('/login');
  }

  try {
    /* Compare input password with database password */
    if (await bcryptjs.compare(req.body.passwordInput, userData.password)) {
      console.log('Success! Logging in...');
      res.redirect('/login');
    } else {
      console.log('Wrong password');
      res.redirect('/login');
    }
  } catch {
    res.status(500).send();
  }
  
});

module.exports = router;