const asyncHandler = require("express-async-handler"); // memudahkan async function untuk berinteraksi dengan error handler
const dotenv = require("dotenv").config();


const { constants } = require("../constants.js");
const supabase = require("../config/DB_config.js");



const sayhello = async (req, res) => {
    const Hello = "Hellow";
    res.statusCode = 200;
    res.json({Hello});
};


module.exports = {sayhello};