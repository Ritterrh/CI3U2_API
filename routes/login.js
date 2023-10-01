const express = require('express');
const mysql2 = require('mysql2')
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { createToken, createRefreshToken} = require('../middleware/verfiytoken');
const my = require("mysql");
require('dotenv').config();
/*
        ---------------------
        Login
        ---------------------
 */



const db = my.createConnection(
    {
        host:process.env.DATENBANK_HOST,
        database: process.env.DATENBANK1,
        user: process.env.DATENBANK_USER,
        password: process.env.DATENBANK_PASS,
    }
);


// API-Route zum Abrufen von Audio-Dateien im Radius



// Login
router.post('/login', async (req, res) => {
    const { emailOrUsername, password } = req.body;

    // Überprüfe, ob E-Mail oder Benutzername und Passwort im Anfragekörper vorhanden sind
    if (!emailOrUsername || !password) {
        return res.status(400).json({ message: 'E-Mail oder Benutzername und Passwort sind erforderlich' });
    }

    try {
        // Überprüfe, ob der Benutzer existiert (anhand von E-Mail oder Benutzernamen)
        const user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
        });
        if (!user) {
            return res.status(401).json({ message: 'Ungültige E-Mail, Benutzername oder Passwort' });
        }

        // Überprüfe das Passwort
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Ungültige E-Mail, Benutzername oder Passwort' });
        }

        // Erstelle ein JWT-Token und Refresh-Token
        const token = createToken(user._id, user.role);
        const refreshToken = createRefreshToken(user._id, user.role);

        // Speichere das JWT-Token im Authorization-Header der HTTP-Antwort
        res.header('Authorization', `Bearer ${token}`);

        // Sende das Refresh-Token in der HTTP-Antwort zurück
        res.json({ refreshToken });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: 'An error occurred while logging in' });
    }
});



module.exports = router;

