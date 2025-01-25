const express = require('express');
const router = express.Router();
const User = require('../schemas/user');
require('dotenv').config();

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ error: 'Username and password are required' });
    }

    try {
        const user = new User({ username, password, companies: [] });
        await user.save();

        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).send({ error: 'Username already exists' });
        }
        console.error('Error registering user:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

module.exports = router;
