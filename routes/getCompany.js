const express = require('express');
const router = express.Router();
const User = require('../schemas/user');

router.get('/', async (req, res) => {
    const { username, companyName } = req.params;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Benutzer nicht gefunden.' });
        }

        const company = user.companies.find(company => company.companyName === companyName);
        if (!company) {
            return res.status(404).json({ success: false, message: 'Firma nicht gefunden.' });
        }

        res.status(200).json({ success: true, data: company });
    } catch (error) {
        console.error('Fehler:', error);
        res.status(500).json({ success: false, message: 'Fehler beim Abrufen der Firmendaten.' });
    }
});

module.exports = router;

