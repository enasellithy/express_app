const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const protect = async (req, res, next) => {
    let token;

    // Check if the Authorization header contains a Bearer token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get the token from the Authorization header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the JWT secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by decoded ID (excluding password)
            req.user = await User.findById(decoded.id).select('-password');

            // Call the next middleware or route handler
            next();
        } catch (error) {
            console.error('Not authorized, token failed');
            return res.status(401).json({
                status: false,
                message: 'Not authorized, token failed',
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            status: false,
            message: 'Not authorized, no token',
        });
    }
};

module.exports = { protect };
