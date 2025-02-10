const express = require('express');
const router = express.Router();
const { createUser,getUser  } = require('../controllers/user.controller');




router.post('/create-user', createUser);
router.post('/get-user', getUser);


module.exports = router