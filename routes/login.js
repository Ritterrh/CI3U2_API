const express = require('express');
const mysql2 = require('mysql2')
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { createToken, createRefreshToken} = require('../middleware/verfiytoken');
/*
        ---------------------
        Login
        ---------------------
 */


const db = mysql2.createConnection({
    host: 'data.filmprojekt1.de',
    port: 3306,
    user: 'Rodi',
    password: '1408',
    database: 'EmscherProjekt'
})


// API-Route zum Abrufen von Audio-Dateien im Radius

router.get('/audio', (req, res) => {
    const userLatitude = parseFloat(req.query.userLatitude);
    const userLongitude = parseFloat(req.query.userLongitude);
    const radius = 5; // Radius in Kilometern

    db.query('SELECT * FROM audio_files', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: "Serverfehler" });
            return;
        }

        const audioFilesInRadius = rows.filter(row => {
            const distance = calculateDistance(userLatitude, userLongitude, row.latitude, row.longitude);
            return distance <= radius;
        });

        res.json({ audioFiles: audioFilesInRadius });
    });
});


// Funktion zur Berechnung der Entfernung (wie zuvor definiert)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Erdradius in Kilometern
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

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

