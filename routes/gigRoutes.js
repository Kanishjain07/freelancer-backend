const express = require('express');
const router = express.Router();
const {
  createGig,
  getMyGigs,
  getAllGigs,
  getGigsByFreelancer
} = require('../controllers/gigController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createGig);
router.get('/my-gigs', auth, getMyGigs);
router.get('/freelancer/:freelancerId', getGigsByFreelancer);
router.get('/', getAllGigs);

module.exports = router;
