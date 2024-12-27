const asyncHandler = require("express-async-handler"); // memudahkan async function untuk berinteraksi dengan error handler
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const validateToken = require("../middleware/TokenHandler.js");
const cookieparser = require("cookie-parser");
const { constants } = require("../constants.js");
const supabase = require("../config/DB_config.js");

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
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "5s"});

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
    res.json(req.user);

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
            }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "10s"});
            console.log("finished");
            res.statusCode = 200;
            
            res.json({accessToken});
        }else{
            
            res.statusCode = constants.UNAUTHORIZED;
            throw new Error("User is not authorized");
            
            
        }
            
        console.log("end");
                
        
    
        
        
    
});


module.exports = {registerUser, loginUser, currentUser, refreshUser};