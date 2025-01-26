const express = require('express');
const router = express.Router();
const User = require('../schemas/user');

router.get('/:username/companies/:companyName/projects', async (req, res) => {
    const { username, companyName } = req.params;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Benutzer nicht gefunden.' });
        }

        const company = user.companies.find((c) => c.companyName === companyName);
        if (!company) {
            return res.status(404).json({ success: false, message: 'Firma nicht gefunden.' });
        }

        res.status(200).json({ success: true, projects: company.projects });
    } catch (error) {
        console.error('Fehler:', error);
        res.status(500).json({ success: false, message: 'Interner Serverfehler.' });
    }
});


module.exports = router;
