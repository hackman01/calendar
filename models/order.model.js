const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
 
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    razorpay_order_id: {
        type: String
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    to_email: {
     type: String
    },

    amount:{
        type: Number,
        required: true
    },
    currency:{
        type: String,
    },
    status: {
        type: String,
        enum: ["pending","captured","fail"],
        default: "pending"
    }


}, {
  timestamps: true
});


module.exports = mongoose.model('Order', orderSchema)