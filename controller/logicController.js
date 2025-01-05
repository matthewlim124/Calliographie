const asyncHandler = require("express-async-handler"); // memudahkan async function untuk berinteraksi dengan error handler
const dotenv = require("dotenv").config();


const { constants } = require("../constants.js");
const supabase = require("../config/DB_config.js");



const sayhello = async (req, res) => {
    const Hello = "Hellow";
    res.statusCode = 200;
    res.json({Hello});
};

//core endpoints

//personalize box
//@route for POST/api/service/personalize
//@access private
const personalize = asyncHandler(async (req, res) => {

    const {product_selection} = req.body;

});


//generic endpoints

//get product
//@route for GET/api/service/getProduct
//@access private
const getProduct = asyncHandler(async (req, res) => {

    //get product list from db for html to display
    
    const {data,error} = await supabase.from("product").select('product_category,product_name, stock');

    res.json(data);
});

//checkout product
//@route for POST/api/service/checkOut
//@access private
const checkOut = asyncHandler(async (req, res) => {

    //
    const {items, username} = req.body;
    console.log(items);
    let idx = 0;
    let stock_update_arr = [];

    for(let item of items){
        console.log(item);
        const {data: productData, error: productError} = await supabase.from("product").select('stock').eq("product_name", item);
        console.log(productData[0].stock);
        stock_update_arr[idx] = productData[0].stock - 1;
        idx += 1;
    }
    idx = 0;
    console.log(stock_update_arr);
    for (let item of items) {
        
        
        
        const { data, error } = await supabase.from("product").update({ stock: stock_update_arr[idx] }).eq("product_name", item);  // Filter by product_name

        // If there's an error with the update, respond with an error message
        if (error) {

            res.status(500).json({ message: `Error updating stock for ${item}: ${error.message}` });
        }

        idx += 1;
    }
    console.log("finished update stock");
    const {data: userData, error: userError} = await supabase.from("user").select("user_id").eq("username", username);
    console.log(userData[0].user_id);
    
    const {data: orderData, error: orderError} = await supabase.from("order").insert([
        {order_product: items, user_id: userData[0].user_id}
    ])
   
    res.json({mesage: 'order ok'});
});



//payment
//@route for 
//@access private
const payment = asyncHandler(async (req, res) => {
    

});

module.exports = {sayhello, getProduct, checkOut};