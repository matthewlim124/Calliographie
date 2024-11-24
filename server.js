const express = require("express");
const connectDb = require("./config/dbConnection.js")
const errorHandler = require("./middleware/errorHandler.js");
const dotenv = require("dotenv").config();
const path = require("path");



connectDb();
const app = express();
const port = process.env.PORT || 5000;



app.use(express.json()); //body parser, get json body dari req


app.use("/api/user", require("./routes/userRoutes.js"));
app.use(errorHandler); //ubah html format dari error ke json


app.use(express.static(path.join(__dirname)));





app.get("/", (req,res) => {
    res.send("Hello World");
});



app.listen(port,() => {
    console.log(`Listening on port ${port}`);
});

