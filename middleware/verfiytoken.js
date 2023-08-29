const jwt = require("jsonwebtoken");
const { json } = require("express");
dotenv = require('dotenv');
dotenv.config();
const jwtSecret = "process.env.SECRET_KEY";
const jwtExpirationTime = 20 * 60; // 15 Minuten
const refreshTokenExpirationTime = 15 * 60 // 15 Minuten
const createToken = (userId, userRole) => {
    return jwt.sign({ id: userId, role: userRole }, jwtSecret, {
        expiresIn: jwtExpirationTime,
    });
};

// Helper function to create Refresh Token
const createRefreshToken = (userId, userRole) => {
    return jwt.sign({ id: userId, role: userRole }, jwtSecret, {
        expiresIn: refreshTokenExpirationTime,
    });
};

// Helper function to verify JWT
const verfiytoken = (token) => {
    return jwt.verify(token, jwtSecret);
};

function authenticateJWT(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Unberechtigter Zugriff: Kein Token vorhanden' });

    // Überprüfe, ob das Token im Bearer-Format vorliegt
    if (!token.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Unberechtigter Zugriff: Token im Bearer-Format fehlt' });
    }

    // Entferne das "Bearer "-Präfix, um das reine Token zu erhalten
    const jwtToken = token.split(' ')[1];

    try {
        req.user = jwt.verify(jwtToken, jwtSecret);
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Unberechtigter Zugriff: Token ungültig oder abgelaufen' });
    }
}

function checkRole(roles) {
    return (req, res, next) => {
        const userRole = req.user.role;

        // Überprüfe, ob die Benutzerrolle eine der erlaubten Rollen ist
        if (!roles.includes(userRole)) {
            return res.status(403).json({ message: 'Forbidden: Zugriff verweigert' });
        }

        // Wenn die Benutzerrolle erlaubt ist, erlaube den Zugriff
        next();
    };
}
module.exports = {createToken, createRefreshToken, verifyToken: verfiytoken, authenticateJWT, checkRole};
