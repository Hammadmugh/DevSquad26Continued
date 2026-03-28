const multer = require("multer");
const path = require("path");

// Use memory storage to avoid disk space issues
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept video and image files
  const allowedMimes = ["video/mp4", "video/webm", "video/quicktime", "image/jpeg", "image/png", "image/webp"];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only video and image files are allowed.`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

module.exports = upload;
