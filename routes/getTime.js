const express = require('express');
const router = express.Router();
const User = require('../schemas/user');

router.get('/:username/companies/:companyName/time-entries', async (req, res) => {
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

        const allTimeEntries = company.projects.reduce((entries, project) => {
            return entries.concat(
                project.timeEntries.map(entry => ({
                    ...entry.toObject(),
                    projectId: project._id,
                    projectTitle: project.title,
                }))
            );
        }, []);

        res.status(200).json({ success: true, timeEntries: allTimeEntries });
    } catch (error) {
        console.error('Fehler beim Abrufen der Zeiteinträge:', error);
        res.status(500).json({ success: false, message: 'Fehler beim Abrufen der Zeiteinträge.' });
    }
});

module.exports = router;
