const express = require("express");
const { registerUser, loginUser, currentUser, refreshUser } = require("../controller/userController");
const router = express.Router();
const validateToken = require("../middleware/TokenHandler.js");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/refresh", refreshUser);

router.get("/current", validateToken, currentUser);

module.exports = router;