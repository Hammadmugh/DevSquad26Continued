const allowedOrigin = (origin, callback) => {
  // Allow requests with no origin (e.g. curl, mobile apps)
  if (!origin) return callback(null, true);
  // Allow any localhost port (local dev)
  if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
  // Allow the deployed Vercel frontend
  if (origin === "https://chat-app-frontend-three-mocha.vercel.app") return callback(null, true);
  // Block everything else
  return callback(new Error("Not allowed by CORS"), false);
};

const corsOptions = {
  origin: allowedOrigin,
  methods: ["GET", "POST", "DELETE"],
  credentials: true,
};

module.exports = { allowedOrigin, corsOptions };
