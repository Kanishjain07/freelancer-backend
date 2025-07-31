const express = require('express');
const { getFreelancerStats, getClientStats } = require('../controllers/dashboardController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/freelancer', auth, getFreelancerStats);
router.get("/client", auth, getClientStats);

module.exports = router;
