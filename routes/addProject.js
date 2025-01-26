const express = require('express');
const router = express.Router();
const User = require('../schemas/user');

router.post('/users/:username/companies/:companyName/projects', async (req, res) => {
    const { username, companyName } = req.params; 
    const { title, commissionNumber } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'Benutzer nicht gefunden.' });
      }
  
      const company = user.companies.find((c) => c.companyName === companyName);
      if (!company) {
        return res
          .status(404)
          .json({ success: false, message: 'Firma nicht gefunden.' });
      }
  
      company.projects.push({ title, commissionNumber });
      await user.save();
  
      res
        .status(201)
        .json({ success: true, message: 'Projekt erfolgreich erstellt.' });
    } catch (error) {
      console.error('Fehler:', error);
      res.status(500).json({ success: false, message: 'Interner Serverfehler.' });
    }
  });  


module.exports = router;
