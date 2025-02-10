const crypto = require('crypto');
const Order = require('../models/order.model');
const Wallet = require('../models/wallet.model');

const verifySignature = async (req,res,next) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        event
   
      } = req.body;
    


      if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature){
        return res.status(400).json({message : "signatures or ids not provided!"});
      }

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      const isAuthentic = expectedSignature === razorpay_signature;

      if(isAuthentic){
        try{
            const order = await Order.findOne({razorpay_order_id});
            const wallet = await Wallet.findOne({user_id:order.user_id});
        wallet.amount = wallet.amount - order.amount;
        order.status = "captured";
        await wallet.save();
        await order.save();
        const orderObject = order.toObject();
        req.event = event;
        req.to_email=orderObject.to_email;
        next();
        } catch(error){
            res.status(404).json({message: "Can't create event!", error: "Order doesn't exists"})
        }
      }
      else{
        return res.status(404).json({message: "Can't create event!", error: "Order doesn't exists"})
      }

}

module.exports = verifySignature;