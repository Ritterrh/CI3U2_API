const express = require('express');
const router = express.Router();
const { verifyToken, createToken, createRefreshToken } = require('../middleware/verfiytoken');
const User = require('../models/User');

// Refresh Token
router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;

    try {
        // Überprüfe das Refresh-Token
        const decodedRefreshToken = verifyToken(refreshToken);
        const userId = decodedRefreshToken.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({ message: 'Ungültiges Refresh-Token' });
        }

        // Erstelle ein neues JWT-Token und Refresh-Token
        const token = createToken(userId);
        const newRefreshToken = createRefreshToken(userId);

        res.json({ token, refreshToken: newRefreshToken });
    } catch (err) {
        console.error('Error refreshing token:', err);
        res.status(500).json({ message: 'An error occurred while refreshing token' });
    }
});

module.exports = router;
