const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {sayhello, getProduct, checkOut, personal, exchange, getOrder , pairfect} = require("../controller/logicController.js");
const validateToken = require("../middleware/TokenHandler.js");


router.post("/checkout",validateToken, checkOut );
router.post("/personal",upload.single('image'), validateToken, personal );
router.post("/pairfect",upload.single('image'), validateToken, pairfect );
router.post("/exchange", validateToken, exchange );
router.post("/getOrder", validateToken, getOrder );
router.get("/sayhello",validateToken, sayhello);
router.get("/getProduct", getProduct);


module.exports = router;