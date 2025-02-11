const User  = require('../models/user.model');
const createWallet = require('./wallet.controller');



const createUser = async (req,res) => {

    try{
        const { email,name } = req.body;

        if (!email || !name) {
            return res.status(400).json({ message: 'Email and name are required' });
        }

        
        const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
    }

   
  

   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

        
        const newUser = new User({
            email:email,
            name:name
        }) 
        const savedUser = await newUser.save();
        await createWallet(newUser._id);

        res.status(201).json(savedUser)

    } catch(error){
        console.log(error);
        res.status(500).json({
            message: "Server Error!",
            error: error.message
        })

    }

}


const getUser = async (req,res) => {
    try{
       const { email } = req.body;
       const user = await User.findOne({email});

       if(!user){
        return res.status(400).json({message: "user not found"})
       }

       res.status(200).json(user); 
    } catch(error){
        res.status(500).json({message : "Can't get the user!",error: error.message});
    }
}

module.exports = {createUser,getUser};