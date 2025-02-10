const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
 
   summary:{
    type: String,
   },
   description:{
    type: String,
   },
   location: {
     type: String
   },
   startDateTime: {
     type: Date
   },
   endDateTime: {
    type: Date
   }


}, {
  timestamps: true
});


module.exports = mongoose.model('Event', eventSchema)