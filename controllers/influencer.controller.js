const { google } = require("googleapis");
const dotenv = require("dotenv");
const Influencer = require('../models/influencer.model');


dotenv.config();


const oauth2Client = new google.auth.OAuth2(  
    process.env.GOOGLE_CLIENT_ID ,
    process.env.GOOGLE_CLIENT_SECRET ,
    'http://localhost:5173'
)

const createInfluencer = async (req, res) => {
    try {
        const { code } = req.body;
        const response = await oauth2Client.getToken(code);
        const userInfoResponse = await fetch(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
                headers: {
                    Authorization: `Bearer ${response.tokens.access_token}`
                }
            }
        );
        googleUserInfo = await userInfoResponse.json();

        const user = await Influencer.findOne({email:googleUserInfo.email}).select('-refresh_token');

        if(user){
            return res.status(200).json(user)
        }

        const newInfluencer = new Influencer({
            email: googleUserInfo.email,
            name: googleUserInfo.name,
            refresh_token: response.tokens.refresh_token
        })
        const savedInfluencer = await newInfluencer.save();
        const influencer = savedInfluencer.toObject();
        delete influencer.refresh_token;
        res.status(201).json(influencer);
    } catch (error) {
         res.status(500).json({
        
            error: 'Server Error',
            message: error.message
        });
    }

}

const getInfluencers = async (req, res) => {
    try {
      
        
        const influencers = await Influencer.find()
            .select('-refresh_token') 
            .sort({ createdAt: -1 });
            
        return res.status(200).json(influencers);
    } catch (error) {
        return res.status(500).json({
        
            error: 'Server Error',
            message: error.message
        });
    }
};

module.exports = { createInfluencer,getInfluencers }