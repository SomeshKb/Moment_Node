const jwt = require("jsonwebtoken");

exports.authenticateToken = function (userData) {
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn:  process.env.JWT_DURATION });
}
