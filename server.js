const express = require("express");
const supabase = require("./config/DB_config.js")
const errorHandler = require("./middleware/errorHandler.js");
const dotenv = require("dotenv").config();
const path = require("path");
const cors = require('cors');
const cookieparser = require("cookie-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

if(supabase){
    console.log("DB connected succesfully!!")
}

const app = express();
const port = process.env.PORT || 8080;



app.use(cors({
    origin: 'https://calliographie-integrated-744429109192.asia-southeast2.run.app', // Your frontend origin
    credentials: true,              // Allow cookies to be sent
}));


// Stripe webhook route with raw body parsing
app.post("/api/service/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK;
    let event;

    try {
        // Construct the event using the raw body and the signature
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle specific events
    
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const user_id = session.metadata.user_id;
        const reward_name = session.metadata.reward_name;
        console.log('Checkout session completed:', session);

        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

            

            for (const item of lineItems.data) {
                const productName = item.description; // Assuming the product name is in the description
                const quantity = item.quantity;
                console.log(quantity);
                // Fetch the product stock from Supabase
                const { data: product, error: productError } = await supabase
                    .from('product')
                    .select('stock')
                    .eq('product_name', productName);

                console.log(product);
                if (productError) throw new Error(`Product fetch error: ${productError.message}`);

                // Calculate the updated stock
                const updatedStock = product[0].stock - quantity;

                // Update stock in Supabase
                const { error: updateError } = await supabase
                    .from('product')
                    .update({ stock: updatedStock })
                    .eq('product_name', productName);

                if (updateError) throw new Error(`Stock update error: ${updateError.message}`);
            }

            const { data: scoreData, error: errorData } = await supabase.from("order").update({ status: true, stripe_payment_url: null }).eq("user_id", user_id);
            
            if (reward_name != '0') {
                const valueToRemove = reward_name;
                
                const { data, error} = await supabase.from("user").select("user_reward").eq("user_id", user_id)
                let newArr = data[0].user_reward;
                newArr = newArr.filter(item => item !== valueToRemove);
                
                const { data: userData, error: userError } = await supabase.from("user").update({ user_reward: newArr }).eq("user_id", user_id);
            }
            
    }

    res.status(200).send('Webhook received');
});



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

