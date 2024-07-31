const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(403).json({ status: "failure", message: "Unauthorized" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.message === "jwt expired") {
        return res.status(401).json({ status: "failure", message: "Token expired" });
      }
      else {
        console.log(err.message);
        return res.status(401).json({ status: "failure", message: "Failed to authenticate token" });
      }
    }
    // If token is valid, save decoded info to request for use in other routes
    req.org_id = decoded.org_id;
    req.name = decoded.organization_name;
    next();
  });
};

module.exports = verifyToken;