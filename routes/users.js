var express = require('express');
var router = express.Router();

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');


const users = [];
const posts = [
  {
    username: 'Rickard',
    title: 'Post 1'
  },
  {
    username: 'Jonas',
    title: 'Post 2'
  }
];

let refreshTokens = [];

// genereate new access token from refresh
router.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken })
  });
});

// test
router.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.name));
});

/* GET (read) users */
router.get('/', function(req, res, next) {
  res.json(users);
});

/* POST (create) user */
router.post('/', async function(req, res, next) {
  try {
    const hashedPassword = await bcryptjs.hash(req.body.password, 10);
    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

/* Login user */
router.post('/login', async (req, res) => {
  const user = users.find(user => user.name === req.body.name)
  if (user == null) {
    return res.status(404).send('Cannot find user');
  }

  try {
    if(await bcryptjs.compare(req.body.password, user.password)) {
      res.send('Success! Logging in...');
    } else {
      res.send('Wrong password');
    }
  } catch {
    res.status(500).send();
  }
});

// delete refresh token
router.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token);
  res.sendStatus(204);
});

// JWT test
router.post('/loginJWT', (req, res) => {
  // Authenticate user first!

  const username = req.body.username;
  const user = { name: username }

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s'});
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  // Bearer TOKEN

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = router;
