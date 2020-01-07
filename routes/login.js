var express = require('express');
var router = express.Router();

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

//var MyMethods = require('../app.js');
//const method = MyMethods.method;
//console.log(MyMethods)

/*
var cookieParser = require('cookie-parser')
router.use(cookieParser())
*/

/* TEST SAKER */

const posts = [
  {
    username: 'Rickard-test',
    title: 'Post 1'
  },
  {
    username: 'Rickard-admin',
    title: 'Post 2'
  }
];

/* GET home page. */
router.get('/', authenticateToken, function (req, res, next) {
  
  //method()
  res.render('login');
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
        email: userData.email
      }
    
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s'});
      res.cookie('accessToken', accessToken, { maxAge: 20000, httpOnly: true });
      next();
      res.redirect('/login');
    } else {
      console.log('Wrong password');
      return res.redirect('/login');
    }
  } catch {
    return res.status(500).send();
  }

  

  

  //const email = userData.email
  

  
  //res.json({ accessToken: accessToken });
  //let cookie = req.cookies.jwtToken;
  /*
  var cookie = req.cookies.jwtToken;
  console.log(req.cookies.jwtToken)
  if (!cookie) {
    
  }
  */
  
  //console.log(cookie)
});

/*
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
*/

// TESTAR
/*
router.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.username));
});
*/

function authenticateToken(req, res, next) {
  console.log('TJENA')
  //const authHeader = req.headers['authorization'];
  console.log(req.cookies.accessToken)
  
  //const token = authHeader && authHeader.split(' ')[1];
  const token = req.cookies.accessToken;
  if (token == null) {

    //res.sendStatus(401);
    console.log('no token')
    next();
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        //res.sendStatus(403);
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