const express = require("express");
const router = express.Router();
const { register, login, subscribe } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/subscribe", authMiddleware, subscribe);

module.exports = router;