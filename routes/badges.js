const express = require('express');
const router = express.Router();
const User = require('../schemas/userInfo');
require('dotenv').config();

router.put('/', async (req, res) => {
    try {
        const { username, action } = req.body;

        if (!username || !action) {
            return res.status(400).json({ message: 'Invalid' });
        }

        const user = await User.findOne({ username });

        if (!user) {
            if (action === 'add') {
                const newUser = new User({
                    username,
                    badges: [
                        {
                            badgeName: 'Holy',
                            badgeUrl: 'https://holy-client.com/assets/badges/HolyBadge.png',
                            dateApproved: new Date(),
                        },
                    ],
                });

                await newUser.save();
                return res.status(200).json({ message: `Holy badge added for new user: ${username}` });
            } else {
                return res.status(404).json({ message: `User ${username} not found` });
            }
        }

        if (action === 'add') {
            const hasHolyBadge = user.badges.some(badge => badge.badgeName === 'Holy');
            if (!hasHolyBadge) {
                user.badges.push({
                    badgeName: 'Holy',
                    badgeUrl: 'https://holy-client.com/assets/badges/HolyBadge.png',
                    dateApproved: new Date(),
                });
                await user.save();
                return res.status(200).json({ message: `Holy badge added for user: ${username}` });
            } else {
                return res.status(200).json({ message: `User ${username} already has the Holy badge` });
            }
        } else if (action === 'remove') {
            user.badges = user.badges.filter(badge => badge.badgeName !== 'Holy');
            await user.save();
            return res.status(200).json({ message: `Holy badge removed for user: ${username}` });
        } else {
            return res.status(400).json({ message: `Invalid action: ${action}` });
        }
    } catch (error) {
        console.error('Error handling Holy badge:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
