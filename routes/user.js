const express = require('express');
const router = express.Router();
const User = require('../schemas/user');

router.get('/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).send({ error: 'User not found.' });
        }

        res.status(200).send({
            username: user.username,
            companies: user.companies.map((company) => ({
                companyName: company.companyName,
                imageUrl: company.imageUrl,
                createdAt: company.createdAt,
                projects: company.projects.map((project) => ({
                    title: project.title,
                    commissionNumber: project.commissionNumber,
                    timeEntries: project.timeEntries.map((entry) => ({
                        employee: entry.employee,
                        hours: entry.hours,
                        description: entry.description,
                        createdAt: entry.createdAt,
                    })),
                })),
                employees: company.employees || [],
            })),
        });
    } catch (error) {
        res.status(500).send({ error: 'Internal server error.' });
    }
});

module.exports = router;
