const express = require('express');
const { createInfluencer, getInfluencers } = require('../controllers/influencer.controller');
const router = express.Router();


router.post('/create-influencer', createInfluencer)
router.get('/get-influencers',getInfluencers)



module.exports = router