const mongoose = require('mongoose');


const influencerSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },

  name: {
    type: String,
    trim: true,
    
  },
  refresh_token:{
    type: String,
    required: true
  }


}, {
  timestamps: true
});


module.exports = mongoose.model('Influencer', influencerSchema)