const express = require("express");
const supabase = require("./config/DB_config.js")
const errorHandler = require("./middleware/errorHandler.js");
const dotenv = require("dotenv").config();
const path = require("path");
const cors = require('cors');
const cookieparser = require("cookie-parser");


if(supabase){
    console.log("DB connected succesfully!!")
}

const app = express();
const port = process.env.PORT || 8080;



app.use(cors({
    origin: 'http://localhost:8080', // Your frontend origin
    credentials: true,              // Allow cookies to be sent
}));


app.use(express.json()); //body parser, get json body dari req
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());

app.use("/api/user", require("./routes/userRoutes.js"));
app.use("/api/service", require("./routes/logicRoutes.js"));

app.use(errorHandler); //ubah html format dari error ke json


app.use(express.static(path.join(__dirname)));





app.get("/", (req,res) => {
    res.send("Hello World");
});



app.listen(port,() => {
    console.log(`Listening on port ${port}`);
});

