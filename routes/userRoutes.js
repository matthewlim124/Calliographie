const express = require("express");
const { registerUser, loginUser, currentUser, refreshUser, updateUser,  apiKey } = require("../controller/userController");
const router = express.Router();
const validateToken = require("../middleware/TokenHandler.js");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/refresh", refreshUser);
router.post("/apiKey", validateToken, apiKey);
router.post("/update", validateToken, updateUser);
router.post("/current", validateToken, currentUser);

module.exports = router;