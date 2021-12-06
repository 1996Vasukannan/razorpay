require('dotenv').config()
var express = require("express");
var app = express();
var Razorpay=require("razorpay");
var bodyParser = require('body-parser')

let instance = new Razorpay({
  key_id: process.env.KEY_ID, // your `KEY_ID`
  key_secret: process.env.KEY_SECRET // your `KEY_SECRET`
})


app.use('/web', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.post("/api/payment/order",(req,res)=>{
params=req.body;
instance.orders.create(params).then((data) => {
       res.send({"sub":data,"status":"success"});
}).catch((error) => {
       res.send({"sub":error,"status":"failed"});
})
});

app.get('/success',(req,res)=>{
    console.log("vasu")
    res.send("success")
})


app.post("/api/payment/verify",(req,res)=>{
body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
var crypto = require("crypto");
var expectedSignature = crypto.createHmac('sha256',process.env.KEY_SECRET)
                                .update(body.toString())
                                .digest('hex');
                                console.log("sig"+req.body.razorpay_signature);
                                console.log("sig"+expectedSignature);

if(expectedSignature === req.body.razorpay_signature){
    res.redirect('/success')
}
 
});


app.listen("3000",()=>{
    console.log("server running at port 3000");
})