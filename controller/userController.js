const asyncHandler = require("express-async-handler"); // memudahkan async function untuk berinteraksi dengan error handler
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const validateToken = require("../middleware/TokenHandler.js");
const cookieparser = require("cookie-parser");
const { constants } = require("../constants.js");
const supabase = require("../config/DB_config.js");
const crypto = require("crypto"); // Node's built-in crypto module
//register user
//@route for POST/api/user/register
//@access public

const registerUser = asyncHandler( async (req,res) =>{
    
    const {username, password} = req.body;
    if(!username || !password){
        res.statusCode = constants.VALIDATION;
        throw new Error("All fields must have value");
    }

    const {data, error} = await supabase.from("user").select('*').eq("username", username)
    
    
    if(data.length > 0){
        res.statusCode = constants.VALIDATION;
        throw new Error("User already registered");
    }

    //hash password
    const hashedPass = await bcrypt.hash(password, 10);
    console.log("Hashed pass: ", hashedPass);

    const user = await supabase.from("user").insert([

        {username: username, password: hashedPass}, 

    ])

    console.log(`User created ${username}`);

    if(user){
        res.statusCode = 201;
        res.json({_id: user.id, username: user.username});
    }else{
        res.statusCode = constants.VALIDATION;
        throw new Error("User creation failed");
    }
    
    res.json({message: "register user"});

});

//login user
//@route for POST/api/user/login
//@access public

const loginUser = asyncHandler( async (req,res) =>{

    const {username, password} = req.body;
    if(!username || !password){
        res.statusCode = constants.VALIDATION;
        throw new Error("All fields must have value");
    }

    //const user = await User.findOne({username});
    const {data, error} = await supabase.from("user").select('*').eq("username", username);
    const user = data[0];

    console.log(`data selected`);
    console.log(data);
    //cmpare pass with hashed one
    if(data.length > 0 && (await bcrypt.compare(password, user.password))){
       
        const accessToken = jwt.sign({
            user: { //payload
                username: user.username,
                id: user.id,

            },
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "3m"});

        const refreshToken = jwt.sign({
            user: { //payload
                username: user.username,
                id: user.id,

            },
        }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "1y"});;
        
        res.cookie('ref_tok', refreshToken, {
            httpOnly: true,
            // sameSite: 'None', 
            // secure: false, // Only send over HTTPS in production
            // maxAge: 30 * 24 * 60 * 60 * 1000
        });

        

        console.log(`refresh token created ${refreshToken}`);
        const add_refresh = await supabase.from("user").update({refresh_token: refreshToken}).eq("username", username);
        res.statusCode = 200;
        
        res.json({accessToken, username});
    }else{
        res.statusCode = constants.UNAUTHORIZED;
        throw new Error("User or email is not valid");
    }

    

});

//current user
//@route for POST/api/user/current
//@access private

const currentUser = asyncHandler( async (req,res) =>{
    
    const {username} = req.body;
    const {data, error} = await supabase.from("user").select('*').eq("username", username);
    const user_score = data[0].user_score;
    const user_reward = data[0].user_reward;

    res.json({user_score, user_reward});

});

//update user in db
//@route for POST/api/user/update
//@access private

const updateUser = asyncHandler( async (req,res) =>{

    const {username, user_score} = req.body;
    const score_int = parseInt(user_score, 10);

    const {data, error} = await supabase.from("user").select('*').eq("username", username);
    const user = data[0];

    let newScore = user.user_score + score_int;
    const update_score = await supabase.from("user").update({user_score: newScore}).eq("username", username);
    
    res.statusCode = 200;
        
    res.json({mesage: "Score update success"});
});


//generate apikey
//@route for POST/api/user/apiKey
//@access private

const apiKey = asyncHandler(async (req,res)=>{
    const { username } = req.body; // Getting username from the request body
    
    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    // Step 1: Generate a secure random API key (you can adjust the length as necessary)
    const apiKey = crypto.randomBytes(32).toString("hex"); // Generates a 64-character hex string
    const string_api = apiKey.toString();

    console.log(apiKey, string_api);
    // Step 2: Store the API key in the database (you'll need a table for API keys associated with users)
    const { data, error } = await supabase.from("user").update({ api_key: string_api }).eq("username", username); // You can adjust this based on how you uniquely identify users
    console.log("database completed");
    if (error) {
        return res.status(500).json({ message: `Error storing API key: ${error.message}` });
    }

    // Step 3: Return the API key in the response (to the user)
    res.statusCode = 200;

    res.json({ message: "API key generated successfully", string_api: string_api});
});


//refresh user token
//@route for POST/api/user/refresh
//@access public


const refreshUser = asyncHandler( async (req, res) => {

    
        const token = req.cookies.ref_tok;
        const {username} = req.body;
        console.log("");
        console.log(`Token from cookie: ${token} and username ${username}`);
        
        console.log(" ");
        const {data, error} = await supabase.from("user").select('*').eq("username", username);
        const user = data[0];
        
        console.log(`supabase clean : refresh token ${user.refresh_token}`);
        
        if(user.refresh_token == token){
            console.log("html clean");
            const accessToken = jwt.sign({
                user: { //payload
                    username: user.username,
                    id: user.id,
    
                },
            }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
            console.log("finished");
            res.statusCode = 200;
            
            res.json({accessToken});
        }else{
            
            res.statusCode = constants.UNAUTHORIZED;
            throw new Error("User is not authorized");
            
            
        }
            
        console.log("end");
                
        
    
        
        
    
});


module.exports = {registerUser, loginUser, currentUser, refreshUser, updateUser, apiKey};