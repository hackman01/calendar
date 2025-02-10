const mongoose = require('mongoose');


const walletSchema = new mongoose.Schema({

 user_id : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
 },
 amount: {
    type: Number,
    required: true
 }

}, {
  timestamps: true
});


module.exports = mongoose.model('Wallet', walletSchema)