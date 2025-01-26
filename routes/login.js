var express = require('express');
var router = express.Router();
const User = require('../schemas/user');

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Username and password are required' });
  }

  try {
    const users = await User.find();

    const mainUser = users.find((user) => user.username === username && user.password === password);

    if (mainUser) {
      return res.status(200).json({
        success: true,
        message: 'Login successful as main user',
        role: 'admin',
        user: mainUser,
      });
    }

    for (const user of users) {
      for (const company of user.companies) {
        const employee = company.employees.find(
          (emp) => emp.name === username && emp.password === password
        );

        if (employee) {
          return res.status(200).json({
            success: true,
            message: 'Login successful as employee',
            role: employee.role || 'employee',
            employee,
            company: company.companyName,
          });
        }
      }
    }

    return res
      .status(401)
      .json({ success: false, message: 'Invalid username or password' });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
