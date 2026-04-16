const express = require("express");
const router = express.Router();
const { register, login, subscribe, getProfile } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/subscribe", authMiddleware, subscribe);
router.get("/profile", authMiddleware, getProfile);

module.exports = router;