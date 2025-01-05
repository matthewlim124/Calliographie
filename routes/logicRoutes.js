const express = require("express");
const router = express.Router();
const {sayhello, getProduct, checkOut} = require("../controller/logicController.js");
const validateToken = require("../middleware/TokenHandler.js");


router.post("/checkout",validateToken, checkOut );

router.get("/sayhello",validateToken, sayhello);
router.get("/getProduct", getProduct);


module.exports = router;