const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const {constants} = require("../constants.js");
const supabase = require("../config/DB_config.js");

const validateTokenJWT = asyncHandler(async(req,res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err){
                if(err.name == "TokenExpiredError"){
                    res.statusCode = constants.UNAUTHORIZED;
                    
                    throw new Error("Expired");
                }else{
                    res.statusCode = constants.UNAUTHORIZED;
                    throw new Error("User is not authorized");
                }
                
            }
            req.user = decoded.user; 
            
            next();
        });

        if(!token){
            res.statusCode = constants.UNAUTHORIZED;
            throw new Error("Token is missing or user not authorized");
        }
    }

    else if (authHeader && authHeader.startsWith("ApiKey")) {
        const apiKey = authHeader.split(" ")[1];
        const {data, error} = await supabase.from("user").select("api_key").eq("api_key", apiKey);
        let predefinedApiKey = data[0].api_key;

        if (!apiKey || apiKey !== predefinedApiKey) {
            res.statusCode = constants.UNAUTHORIZED;
            throw new Error("Invalid API Key");
        }

        // If valid, allow the request to proceed
        //req.user = { apiKey: apiKey }; // Optionally attach the API key to the request object for further usage
        next();
    } else {
        // If neither Bearer token nor ApiKey is provided
        res.statusCode = constants.UNAUTHORIZED;
        throw new Error("Authorization header missing or invalid");
    }
})



    
module.exports = validateTokenJWT;
