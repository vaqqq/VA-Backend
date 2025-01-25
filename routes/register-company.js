const express = require('express');
const router = express.Router();
const Company = require('../schemas/company');
require('dotenv').config();

router.post('/', async (req, res) => {
    const { companyName, imageUrl, adminUsername, adminPassword } = req.body;
  
    if (!companyName || !imageUrl || !adminUsername || !adminPassword) {
      return res
        .status(400)
        .send({ error: 'All fields are required' });
    }
  
    try {
      const company = new Company({ companyName, imageUrl, adminUsername, adminPassword });
      await company.save();
  
      res.status(201).send({ message: 'Company registered successfully' });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).send({ error: 'Company already exists' });
      }
      console.error('Error registering company:', error);
      res.status(500).send({ error: 'Internal server error' });
    }
});

module.exports = router;
