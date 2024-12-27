const express = require("express");
const router = express.Router();
const {sayhello } = require("../controller/logicController.js");
const validateToken = require("../middleware/TokenHandler.js");


router.use(validateToken);

router.get("/sayhello", sayhello);

module.exports = router;