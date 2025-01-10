const asyncHandler = require("express-async-handler"); // memudahkan async function untuk berinteraksi dengan error handler
const dotenv = require("dotenv").config();
const axios = require('axios');
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { constants } = require("../constants.js");
const supabase = require("../config/DB_config.js");
const multer = require('multer');
const { get } = require("../routes/logicRoutes.js");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const FormData = require('form-data')

const sayhello = async (req, res) => {
    const Hello = "Hellow";
    res.statusCode = 200;
    res.json({Hello});
};



//personal ai
//@route for POST/api/service/personal
//@access private
const personal = async (req, res) => {

    console.log('Request received:', req.body);
    const { text } = req.body; 
    const imageFile = req.file;
  
    if (!text) {
        res.statusCode = constants.VALIDATION;
        throw new Error("Expecting text!");
        
    }

    if(!imageFile){
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `You are a calligraphy teacher, and a student ask you this  ${text}, if you think it is not related at all 
        to calligraphy, respond that you do not know politely, else answer the question correctly. After that, i want you to give
        a rating or score from scale 1 to 5 based on the creativity and complexity of the question in the form of {{number}} at the end of 
        your answer or respond. Its fine not give your reasoning for the score because i am not going to show the score to the student`;

        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        res.json(result.response.text());
    
    }else{
        const imageBuffer = imageFile.buffer;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const imagePart = {
            inlineData: {
                data: imageBuffer.toString('base64'),
                mimeType: imageFile.mimetype,  // Use the mime type of the uploaded image
            },
        };

        const prompt = `You are a calligraphy teacher, and a student ask you this  ${text}, if you think it is not related at all 
        to calligraphy, respond that you do not know politely, else answer the question correctly. After that, i want you to give
        a rating or score from scale 1 to 5 based on the creativity and complexity of the question in the form of {{number}} at the end of 
        your answer or respond. Its fine not give your reasoning for the score because i am not going to show the score to the student.`;

        const result = await model.generateContent([prompt, imagePart]);
        console.log(result.response.text());
        res.json(result.response.text());
    }
    


};

//pairfect service
//@route for POST/api/service/pairfect
//@access private

const pairfect = async(req,res) =>{

    const { keyword } = req.body;
    const imageFile = req.file;
    const imageBuffer = imageFile.buffer;
    const api_key = process.env.PAIRFECT_API_KEY;

    try {
    const formData = new FormData();
    formData.append('image', imageBuffer, 'image.jpg'); // Add filename (image.jpg or any other) if necessary
    formData.append('keyword', keyword);
    formData.append('include_faces', 'false');

    console.log("Entering pairfect");

    const response = await axios.post('https://pairfect.codebloop.my.id/api/v1/images/pairs', formData, {
        headers: {
        'accept': 'application/json',
        'X-API-Key': api_key,
        'Content-Type': 'multipart/form-data', // Let axios handle the content type for you
        ...formData.getHeaders() // Include form-data headers
        }
    });

    

    // Access response data directly
    

    // Respond with the data received from the API
    res.json(response.data.result_image_uri);

    } catch (error) {
    console.error('Error sending request:', error);
    res.status(500).json({ error: 'Failed to process image' }); // Return a response with a 500 status code
    }


}

//exchange rewards
//@route for POST/api/service/exchange
//@access private

const exchange = asyncHandler(async(req,res) => {

    const {reward, username}  = req.body;

    
    
    const {data: rewardData,error: rewardError} = await supabase.from("reward").select('required_score').eq('reward_name', reward);

    const {data: userData, error: userError} = await supabase.from("user").select('user_score, user_reward').eq('username', username);

    if(rewardError || userError){
        throw new Error("Error occured from database, please try again..");
    }

    const existingArr = userData[0].user_reward;
    const updatedArr = [...existingArr, reward];
        
    
    if(userData[0].user_score >= rewardData[0].required_score){
        
        const {data,error} = await supabase.from("user").update({user_reward: updatedArr}).eq("username", username);

        let newScore = userData[0].user_score - rewardData[0].required_score;
        const { data: scoreData, error: errorData } = await supabase.from("user").update({ user_score: newScore }).eq("username", username);
        res.json({message: "Exchanged finished !!"});
    }else{
        res.json({message: "Points not Enough !!"});
    }
    
})




//get product
//@route for GET/api/service/getProduct
//@access private
const getProduct = asyncHandler(async (req, res) => {

    //get product list from db for html to display
    
    const {data,error} = await supabase.from("product").select('product_category,product_name, stock, price, description');

    res.json(data);
});




//checkout product
//@route for POST/api/service/checkOut
//@access private
const checkOut = async (req, res) => {

    //ORDER CREATION
    const {items, username, isCoupon} = req.body;
    console.log(items, isCoupon);
    let idx = 0;
    let stock_update_arr = [];
    let price_arr = [];

    for(let item of items){
        console.log(item);
        const {data: productData, error: productError} = await supabase.from("product").select('stock, price').eq("product_name", item);
        console.log(productData[0].stock);
        stock_update_arr[idx] = productData[0].stock - 1;
        price_arr[idx] = productData[0].price;
        idx += 1;
    }
    idx = 0;
    let total_price = 0;
    console.log(stock_update_arr);
    console.log("price arr: ", price_arr[idx]);
    for (let item of items) {
        
        
        
        

        // If there's an error with the update, respond with an error message
        // if (error) {

        //     res.status(500).json({ message: `Error updating stock for ${item}: ${error.message}` });
        // }
        total_price += price_arr[idx];
        idx += 1;
    }
    console.log("finished update stock");
    const {data: userData, error: userError} = await supabase.from("user").select("user_id").eq("username", username);
    console.log(userData[0].user_id);
    
    
    const {data: orderExistData, error: orderExistError} = await supabase.from("order").select("*").eq("user_id", userData[0].user_id);

    if(orderExistData){
        for(let orderExist of orderExistData){
            console.log(orderExist.status);
            if(orderExist.status == false){
                return res.json({message: "Please pay your previous order first!"});
            }
        }
    }
   

   
    const {data: orderData, error: orderError} = await supabase.from("order").insert([
        {order_product: items, user_id: userData[0].user_id, status: false}
    ])

    //Payment Stripe 

    const lineItemArr = [];
    idx = 0;
    for (let item of items){
        lineItemArr[idx] = {

            price_data:{
                currency: 'usd',
                product_data: {
                    name: item
                },
                unit_amount: price_arr[idx] * 100
            },
            quantity: 1
        }

        idx += 1;
        
    }
    
    if(isCoupon){

        const {data: rewardData, error: rewardError} = await supabase.from("reward").select("reward_name, coupon_id").eq("reward_name", isCoupon);
        const couponId = rewardData[0].coupon_id;
        const session_stripe = await stripe.checkout.sessions.create({
            line_items: lineItemArr,
            mode: 'payment',
            success_url: 'https://calliographie-integrated-744429109192.asia-southeast2.run.app/success.html',
            cancel_url: 'https://calliographie-integrated-744429109192.asia-southeast2.run.app/home.html',
            metadata: {
                user_id: userData[0].user_id,
                reward_name: rewardData[0].reward_name,
            },

            discounts: [
                {
                    coupon: couponId,
                },
            ],
        });
        console.log(session_stripe);

        const {data: orderData, error: orderError} = await supabase.from("order").update({stripe_payment_url: session_stripe.url }).eq("user_id", userData[0].user_id );

        res.json({url: session_stripe.url});
    }else{
        const session_stripe = await stripe.checkout.sessions.create({
            line_items: lineItemArr,
            mode: 'payment',
            success_url: 'https://calliographie-integrated-744429109192.asia-southeast2.run.app/success.html',
            cancel_url: 'https://calliographie-integrated-744429109192.asia-southeast2.run.app/home.html',
            metadata: {
                user_id: userData[0].user_id,
                reward_name: '0'
            }
        });
        console.log(session_stripe);

        const {data: orderData, error: orderError} = await supabase.from("order").update({stripe_payment_url: session_stripe.url  }).eq("user_id", userData[0].user_id );

        res.json({url: session_stripe.url});
    }
    

    
    
};

//get order
//@route for POST/api/service/getOrder
//@access private

const getOrder = asyncHandler(async (req,res)=> {
    const {username} = req.body;
    const {data, error} = await supabase.from("user").select("user_id").eq("username", username);
    const {data: orderData, error: orderError} = await supabase.from("order").select("order_id, order_product, status, stripe_payment_url").eq("user_id", data[0].user_id);

    res.json(orderData);
})



module.exports = {sayhello, getProduct, checkOut, personal, exchange, getOrder, pairfect};