const { Router } = require("express");
const { rooms } = require("../data/store");

const router = Router();

router.get("/", (req, res) => {
  res.json(rooms);
});

module.exports = router;
