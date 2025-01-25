var express = require('express');
var router = express.Router();
const User = require('../schemas/user');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).send({ error: 'Username and password are required' });
    }
  
    try {
      const user = await User.findOne({ username, password });
  
      if (!user) {
        return res.status(401).send({ error: 'Invalid username or password' });
      }
  
      res.status(200).send({ message: 'Login successful' });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).send({ error: 'Internal server error' });
    }
  });

module.exports = router;