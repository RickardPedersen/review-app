var express = require('express');
var router = express.Router();
const bcryptjs = require('bcryptjs');

const users = [];

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

module.exports = router;
