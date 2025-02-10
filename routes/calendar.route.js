const express = require('express');
const router = express.Router();
const { createEvent, getEvents, getEventsByDateRange, updateEvent, deleteEvent  } = require('../controllers/calendar.controller');

const verifySignature = require('../middlewares/verifySignatures');


router.post('/create-event',verifySignature, createEvent)


router.get('/get-events', getEvents)
router.get('/get-date-range-events', getEventsByDateRange)

router.put('/update-event', updateEvent)

router.delete('/delete-event', deleteEvent)

module.exports = router