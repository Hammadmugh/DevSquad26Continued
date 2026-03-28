const jwt = require("jsonwebtoken");
const { constants } = require("./constants");

const adminMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(constants.UNAUTHORIZED);
      throw new Error("No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== "admin") {
      res.status(constants.FORBIDDEN);
      throw new Error("Only admins can access this resource");
    }

    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = adminMiddleware;
