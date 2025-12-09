const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {
  try {
    // 1. Check if the Authorization header exists
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // 2. The header format is usually "Bearer <token>". We need to split it.
    const token = authHeader.split(' ')[1]; 
    
    if (!token) {
      return res.status(401).json({ error: "Access denied. Invalid token format." });
    }

    // 3. Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the user information to the request object
    // So the next function (controller) knows who is logged in
    req.user = decoded;

    // 5. Allow access to the next route/controller
    next();

  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

module.exports = authentication;