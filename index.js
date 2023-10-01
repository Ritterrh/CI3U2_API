const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const cors = require('cors');
console.log('Cors werden gesetzt');
app.use(cors({
    AcessControlAllowCredentials: true,
    AcessControlAllowHeaders: true,
    AcessControlAllowMethods: true,
    AcessControlAllowOrigin: '*',

    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],

}))


console.log('Cors sind gesetzt');

console.log('Routes werden importiert');
//import Routes
const galleryRoute = require('./routes/gallery');
const newsRoute = require('./routes/news');
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const tagsRoute = require('./routes/tags');
const AngeboteRoute = require('./routes/angebote');
const refresh = require('./routes/refreshtoken');
const authRoute = require('./routes/auth');
const {response} = require("express");
const my = require("mysql");

console.log('Routes sind Importiert');

console.log('Middleware sind gesetzt');
// Middleware
app.use(express.json());

console.log('Middleware sind gesetzt');

console.log('Routes werden gesetzt');
// Routes
app.use('/api', galleryRoute);
app.use('/api', newsRoute);
app.use('/api', loginRoute);
app.use('/api', registerRoute);
app.use('/api', tagsRoute);
app.use('/api', AngeboteRoute);
app.use('/api', refresh);
app.use('/api', authRoute);
app.use(express.static(path.join(__dirname, '../public')));

console.log('Routes sind gesetzt');

console.log('Lade Umgebungsvariablen');

// Load environment variables
require('dotenv').config();

console.log('Umgebungsvariablen geladen');

console.log('Verbinde mit der Datenbank');
// Connec  t to DB
connect().catch(err => console.log(err));

async function connect() {
    await mongoose.connect(process.env.DB_URL);
    console.log('Verbunden mit der Datenbank');
}

const db = my.createConnection(
    {
        host:process.env.DATENBANK_HOST,
        database: process.env.DATENBANK1,
        user: process.env.DATENBANK_USER,
        password: process.env.DATENBANK_PASS,
    }
);
app.get('/',  async (req, res) => {
    const userLatitude = parseFloat(req.query.userLatitude);
    const userLongitude = parseFloat(req.query.userLongitude);
    const radius = 5; // Radius in Kilometern
    console.log(userLongitude, userLatitude);

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

        res.json({ audioFiles: audioFilesInRadius }).status(200);
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


// Start the server
app.listen(3000, () => console.log('Server gestartet auf Port 3000'));

