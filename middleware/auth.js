const jwt = require("jsonwebtoken");
const config = require("config");
const secret = config.get("jwtSecret");

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({message: "No token. Authorization denied."});
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({message: "Token is not valid."});
  }
}
