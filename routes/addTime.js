const express = require('express');
const router = express.Router();
const User = require('../schemas/user');

router.post('/:username/companies/:companyName/projects/:projectId/time-entries', async (req, res) => {
    const { username, companyName, projectId } = req.params;
    const { employee, hours, description } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Benutzer nicht gefunden.' });
        }

        const company = user.companies.find(company => company.companyName === companyName);
        if (!company) {
            return res.status(404).json({ success: false, message: 'Firma nicht gefunden.' });
        }

        const project = company.projects.id(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Projekt nicht gefunden.' });
        }

        project.timeEntries.push({ employee, hours, description });
        await user.save();

        res.status(201).json({ success: true, message: 'Zeiteintrag erfolgreich hinzugefügt.' });
    } catch (error) {
        console.error('Fehler:', error);
        res.status(500).json({ success: false, message: 'Fehler beim Hinzufügen des Zeiteintrags.' });
    }
});

module.exports = router;
