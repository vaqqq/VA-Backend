const express = require('express');
const router = express.Router();
const User = require('../schemas/user');

router.post('/:username/companies/:companyName/employees', async (req, res) => {
    const { username, companyName } = req.params;
    const { name, password } = req.body;

    console.log('Empfangene Daten:', { name, password });

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Benutzer nicht gefunden.' });
        }

        const company = user.companies.find((c) => c.companyName === companyName);
        if (!company) {
            return res.status(404).json({ success: false, message: 'Firma nicht gefunden.' });
        }

        if (!name || !password) {
            return res.status(400).json({ success: false, message: 'Name und Passwort sind erforderlich.' });
        }

        company.employees.push({ name, password, role: 'employee' });
        await user.save();

        res.status(201).json({ success: true, message: 'Mitarbeiter erfolgreich hinzugefügt.' });
    } catch (error) {
        console.error('Fehler:', error);
        res.status(500).json({ success: false, message: 'Interner Serverfehler.' });
    }
});

  

module.exports = router;
