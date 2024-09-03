const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(403).json({ status: "failure", message: "Unauthorized" });
  }
  jwt.verify(authorization, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.message === "jwt expired") {
        return res.status(401).json({ status: "failure", message: "token expired" });
      }
      else {
        console.log(err.message);
        return res.status(401).json({ status: "failure", message: "Failed to authenticate authorization" });
      }
    }
    // If authorization is valid, save decoded info to request for use in other routes
    req.username = decoded.username;
    req.div_id=decoded.div_id
    next();
  });
};

module.exports = verifyToken;