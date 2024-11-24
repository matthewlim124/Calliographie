const asyncHandler = require("express-async-handler"); // memudahkan async function untuk berinteraksi dengan error handler
const User = require("../models/userModel.js") ;
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { constants } = require("../constants.js");
//register user
//@route for POST/api/user/register
//@access public

const registerUser = asyncHandler( async (req,res) =>{
    
    const {username, password} = req.body;
    if(!username || !password){
        res.statusCode = constants.VALIDATION;
        throw new Error("All fields must have value");
    }

    const userAvail = await User.findOne({ username });
    if(userAvail){
        res.statusCode = constants.VALIDATION;
        throw new Error("User already registered");
    }

    //hash password
    const hashedPass = await bcrypt.hash(password, 10);
    console.log("Hashed pass: ", hashedPass);

    const user = await User.create({
        username,
        password: hashedPass,
    });

    console.log(`User created ${user}`);

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

    const user = await User.findOne({username});

    //cmpare pass with hashed one
    if(user && (await bcrypt.compare(password, user.password))){
       
        const accessToken = jwt.sign({
            user: { //payload
                username: user.username,
                id: user.id,

            },
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "30m"});
        res.statusCode = 200;
        res.json({accessToken});
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



module.exports = {registerUser, loginUser, currentUser};