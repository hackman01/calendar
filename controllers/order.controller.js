const Order = require('../models/order.model');
const Event = require('../models/event.model');
const Wallet = require('../models/wallet.model');
const Influencer = require('../models/influencer.model');
const { isConflicting } = require('../utils/conflicts')
const validateEventDateTime = require('../utils/validate')
const Razorpay = require('razorpay');
const dotenv = require('dotenv');
dotenv.config();



var instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })



const createOrder = async (req,res) => {


  try{
    const { user_id,to_email,amount,event_data, currency } = req.body;

    const wallet = await Wallet.findOne({user_id});
    if(wallet.amount<amount){
      return res.status(500).json({message:"Payment not allowed",error:"Not sufficient amount in your wallet!"})
    }

    const influencer = await Influencer.findOne({email:to_email});
    if(!influencer){
      return res.status(404).json({message: "Influencer not found!"});
    }

    const valid = validateEventDateTime.validateEventTimes(event_data.startDateTime,event_data.endDateTime); 
        if(!valid.isValid){
            return res.status(400).json({
                message: "Invalid data format!",
                error: valid.errors
            })
        }

        let conflict = await isConflicting(event_data.startDateTime,event_data.endDateTime,to_email);
       
        if(conflict){
            return res.status(400).json({
                message: "Conflicting events found!"
            })
        }

    var options = {
      amount: amount*100,
      currency,
      receipt: `order_rcptid_${Date.now()}`
    };
    instance.orders.create(options, function(err, order) {
      if(err){
        console.log(err);
      }
      console.log(order);
    });
     const order = await instance.orders.create(options);
       console.log(order);
       const newEvent = new Event({
         ...event_data
       })
       const event = await newEvent.save();
       const newOrder = new Order({
         user_id,to_email,amount,event_id: event._id,currency,razorpay_order_id: order.id
       })
       await newOrder.save();
       res.status(201).json({message:"Order created successfully!",order_id: order.id})
     
    //  res.status(200).json(orderInprogress);
  } catch(error){

    console.log(error);

    res.status(500).json({message: " Cant place the order", error: error.message});

  }


}

const updateStatus = async (req,res) => {

  try{

    const { order_id } = req.query;

    const order = await Order.findByIdAndUpdate(order_id,{ status: "fail" }, { new: true });

    return res.status(202).json({message: "Updated the status!"});

  } catch(error){
    res.status(500).json({message: "Error updating status!"})
  }

}

module.exports = { createOrder,updateStatus }