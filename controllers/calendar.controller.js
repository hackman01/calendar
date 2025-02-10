const { google } = require("googleapis");
const dotenv = require("dotenv");
const validateEventDateTime = require("../utils/validate");
const { isConflicting } = require('../utils/conflicts');
const Influencer = require('../models/influencer.model');

dotenv.config();


const oauth2Client = new google.auth.OAuth2(  
    process.env.GOOGLE_CLIENT_ID ,
    process.env.GOOGLE_CLIENT_SECRET ,
    'http://localhost:5173'
)



const createEvent = async (req,res)=>{
    try{
        const { summary,description, location,startDateTime,endDateTime } = req.event;
        console.log(req.event);
        const to_email = req.to_email;

        const influencer = await Influencer.findOne({email:to_email});
      
        
        const REFRESH_TOKEN = influencer.refresh_token;

        

        oauth2Client.setCredentials({refresh_token:REFRESH_TOKEN});
        const calendar = google.calendar('v3');

       

        const response  = await calendar.events.insert({
            auth: oauth2Client,
            calendarId: 'primary',
            sendNotifications : true,
            requestBody :{
                summary,
                location,
                description,
                colorId: '7',
                start:{
                    dateTime: new Date(startDateTime)
                },
                end:{
                    dateTime: new Date(endDateTime)
                }
            }
        })
        res.status(201).json({
        message: "Successfully created the event!",
        data: response
    });
    } catch(error){
        console.error('Error fetching events:', error);
      res.status(500).json({
        error: 'Failed to fetch events',
        details: error.message
      });
    }
}

const getEvents = async (req, res) => {
    try {

      const to_email = req.query.to_email;

        const influencer = await Influencer.findOne({email:to_email});
      
        
        const REFRESH_TOKEN = influencer.refresh_token;
      
      oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
      
      
      const calendar = google.calendar('v3');
      
     
      const response = await calendar.events.list({
        auth: oauth2Client,
        calendarId: 'primary',
        singleEvents: true,
        orderBy: 'startTime',
      });
  
      const events = response.data.items;
      res.status(200).json({data:events});
      
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({
        error: 'Failed to fetch events',
        details: error.message
      });
    }
  };


const getEventsByDateRange = async (req, res) => {
    try {
      const { startDateTime,endDateTime,to_email } = req.query;

     

        const influencer = await Influencer.findOne({email:to_email});
      
        
        const REFRESH_TOKEN = influencer.refresh_token;


      if (!startDateTime || !endDateTime) {
        return res.status(400).json({
          error: 'Please Provide range',
          message: 'Start Time and End Time not provided'
        });
      }

     
        
        const valid = validateEventDateTime.validateEventTimes(startDateTime,endDateTime); 
        if(!valid.isValid){
            return res.status(400).json({
                message: "Invalid data format!",
                error: valid.errors
            })
        }
      

      oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
      
      
      const calendar = google.calendar('v3');
      
      
      const response = await calendar.events.list({
        auth: oauth2Client,
        calendarId: 'primary',
        timeMin : new Date(startDateTime),
        timeMax : new Date(endDateTime),
        singleEvents: true,
        orderBy: 'startTime',
      });
  
      const events = response.data.items;
      res.status(200).json({
        data: events
    });
      
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({
        error: 'Failed to fetch events',
        details: error.message
      });
    }
  };

const updateEvent = async (req, res) => {
    try {
      const { eventId,to_email } = req.query;
      const { summary, description, location, startDateTime, endDateTime,status } = req.body;
  
     

        const influencer = await Influencer.findOne({email:to_email});
      
        
        const REFRESH_TOKEN = influencer.refresh_token;

      if (!eventId) {
        return res.status(400).json({
          error: 'Missing event ID',
          message: 'Event ID is required'
        });
      }
  
      
      if (!summary && !description && !location && !startDateTime && !endDateTime) {
        return res.status(400).json({
          error: 'No updates provided',
          message: 'At least one field must be provided for update'
        });
      }
    
     
      oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
      
     
      const calendar = google.calendar('v3');
  
      
      const existingEvent = await calendar.events.get({
        auth: oauth2Client,
        calendarId: 'primary',
        eventId: eventId
      });
  
      if(startDateTime || endDateTime){
        const start = startDateTime || existingEvent.data.start;
        const end = endDateTime || existingEvent.data.end;
        const valid = validateEventDateTime.validateEventTimes(start,end); 
        if(!valid.isValid){
            return res.status(400).json({
                message: "Invalid data!",
                error: valid.errors
            })
        }
        if(isConflicting(start,end,oauth2Client,calendar)){
            return res.status(400).json({
                message: "Conflicting events found!"
            })
        }
      }

      const updatePayload = {
        auth: oauth2Client,
        calendarId: 'primary',
        eventId: eventId,
        sendNotifications : true,
        requestBody: {
          ...existingEvent.data,  
          
          summary: summary || existingEvent.data.summary,
          description: description || existingEvent.data.description,
          location: location || existingEvent.data.location,
          status: status || existingEvent.data.status,
          start: startDateTime ? {
            dateTime: new Date(startDateTime)
          } : existingEvent.data.start,
          end: endDateTime ? {
            dateTime: new Date(endDateTime)
          } : existingEvent.data.end,

        }
      };
  
     
      const response = await calendar.events.update(updatePayload);
  
      res.json({
        message: 'Event updated successfully',
        event: response.data
      });
  
    } catch (error) {
      console.error('Error updating event:', error);
      
      
      if (error.code === 404) {
        return res.status(404).json({
          message: 'Event not found',
          
        });
      }
  
      res.status(500).json({
        error: 'Failed to update event',
        details: error.message
      });
    }
  };

const deleteEvent = async (req,res)=>{
    try{
        const { eventId,to_email } = req.query;

        

        const influencer = await Influencer.findOne({email:to_email});
      
        
        const REFRESH_TOKEN = influencer.refresh_token;
        
        if(!eventId){
            return res.status(400).json({
                message : "Please provide EventId"
            })
        }
        oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

        const calendar = google.calendar('v3');

        const deletePayload = {
            auth: oauth2Client,
            calendarId : 'primary',
            eventId : eventId,
            sendNotifications : true
        }

        try {
            await calendar.events.get({
              auth: oauth2Client,
              calendarId: 'primary',
              eventId: eventId
            });
          } catch (error) {
            if (error.code === 404) {
              return res.status(404).json({
                error: 'Event not found',
                message: 'The specified event does not exist'
              });
            }
            
          }

         await calendar.events.delete(deletePayload);
        res.status(200).json({
            message: "successfully deleted the event!",
            eventId: eventId
        })

    } catch(error){
        console.log("Error deleting event", error)

        res.status(500).json({
            error: 'Failed to delete event',
            details: error.message
          });
    }
  };

module.exports = { createEvent,getEvents,getEventsByDateRange,updateEvent,deleteEvent }