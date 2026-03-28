const { constants } = require("../middlewares/constants");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  
  const errorResponse = {
    success: false,
    data: null,
    message: err.message || "An error occurred",
  };

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;