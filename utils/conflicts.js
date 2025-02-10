
const { google } = require("googleapis");
const dotenv = require("dotenv");
const Influencer = require('../models/influencer.model');

dotenv.config();

const oauth2Client = new google.auth.OAuth2(  
  process.env.GOOGLE_CLIENT_ID ,
  process.env.GOOGLE_CLIENT_SECRET ,
  'http://localhost:5173'
)
const calendar = google.calendar('v3');

const isConflicting = async (startDateTime,endDateTime,to_email) => {


  const influencer = await Influencer.findOne({email:to_email});
      
        
        const REFRESH_TOKEN = influencer.refresh_token;

        

        oauth2Client.setCredentials({refresh_token:REFRESH_TOKEN});
      
      const response = await calendar.events.list({
        auth: oauth2Client,
        calendarId: 'primary',
        timeMin : new Date(startDateTime),
        timeMax : new Date(endDateTime),
        singleEvents: true,
        orderBy: 'startTime',
      });
  
      const events = response.data.items;
      console.log(events);

      return events.length!==0;

}

module.exports = { isConflicting }