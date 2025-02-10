const express = require('express');
const router = express.Router();
const { createOrder,updateStatus  } = require('../controllers/order.controller');




router.post('/create-order', createOrder);
router.get('/update-status',updateStatus);


module.exports = router