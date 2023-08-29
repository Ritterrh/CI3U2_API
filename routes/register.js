const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');


// Registrierung
router.post('/register', async (req, res) => {
    const { username, email, password, role, profilImage } = req.body;

    // Überprüfe, ob alle erforderlichen Daten vorhanden sind
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Benutzername, E-Mail und Passwort sind erforderlich' });
    }

    try {
        // Überprüfe, ob die E-Mail bereits registriert ist
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Diese E-Mail ist bereits registriert' });
        }

        // Hash des Passworts erstellen
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Benutzer erstellen
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user', // Wenn role nicht angegeben ist, wird standardmäßig 'user' verwendet
            profilImage: profilImage || '', // Wenn profilImage nicht angegeben ist, wird ein leerer String verwendet
        });

        await user.save();

        res.json({ message: 'Registrierung erfolgreich' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'An error occurred while registering user' });
    }
});

module.exports = router;
