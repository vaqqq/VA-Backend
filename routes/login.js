var express = require('express');
var router = express.Router();
const User = require('../schemas/user');

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ error: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });

    if (user && user.password === password) {
      return res.status(200).send({
        message: 'Login successful as main user',
        role: 'admin',
        user,
      });
    }

    const matchedEmployee = user?.companies.flatMap((company) => company.employees)
      .find((employee) => employee.name === username && employee.password === password);

    if (matchedEmployee) {
      return res.status(200).send({
        message: 'Login successful as employee',
        role: matchedEmployee.role || 'employee',
        employee: matchedEmployee,
      });
    }

    return res.status(401).send({ error: 'Invalid username or password' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

module.exports = router;
