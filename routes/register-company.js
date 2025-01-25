const express = require('express');
const router = express.Router();
const User = require('../schemas/user');
require('dotenv').config();

router.post('/', async (req, res) => {
    const { companyName, imageUrl, adminUsername, adminPassword } = req.body;

    if (!companyName || !imageUrl || !adminUsername || !adminPassword) {
        return res.status(400).send({ error: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ username: adminUsername });

        if (!user) {
            return res.status(404).send({ error: 'Admin user not found' });
        }

        if (user.password !== adminPassword) {
            return res.status(401).send({ error: 'Invalid admin credentials' });
        }

        const existingCompany = user.companies.find(
            (company) => company.companyName === companyName
        );

        if (existingCompany) {
            return res.status(409).send({ error: 'Company already exists for this user' });
        }

        const newCompany = {
            companyName,
            imageUrl,
            createdAt: new Date(),
            projects: [],
        };

        user.companies.push(newCompany);
        await user.save();

        res.status(201).send({
            message: 'Company registered successfully',
            company: newCompany,
        });
    } catch (error) {
        console.error('Error registering company:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

module.exports = router;
