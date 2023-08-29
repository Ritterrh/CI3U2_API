const express = require('express');
const router = express.Router();
const {  authenticateJWT } = require('../middleware/verfiytoken'); // Import the middleware for authentication and role check
router.get('/auth', authenticateJWT,async (req, res) => {
    // If the middleware above is passed, it means the user is authenticated
    res.status(200).json({ authenticated: true });
});
module.exports = router;