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

app.get('/',  async (req, res) => {
    res.sendStatus(200)
});


// Start the server
app.listen(3000, () => console.log('Server gestartet auf Port 3000'));

