const Wallet = require('../models/wallet.model');


const createWallet = async (user_id)=>{
    try{
     const newWallet = new Wallet({
        user_id,
        amount: 1000
     })
     await newWallet.save();
    }catch(error){
      console.log(error);
    }
}

module.exports = createWallet