// Allow any localhost port so Vite's dev port (5173, 5174, etc.) always works
const allowedOrigin = /^http:\/\/localhost:\d+$/;

const corsOptions = {
  origin: allowedOrigin,
};

module.exports = { allowedOrigin, corsOptions };
