const Gig = require("../models/Gig");

const createGig = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const userId = req.user.id;

    const newGig = await Gig.create({ title, description, price, createdBy: userId });
    res.status(201).json(newGig);
  } catch (err) {
    res.status(500).json({ message: "❌ Could not create gig", error: err.message });
  }
};

const getAllGigs = async (req, res) => {
  try {
    const gigs = await Gig.find().populate("createdBy", "name email");
    res.status(200).json(gigs);
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to fetch gigs", error: err.message });
  }
};

// Placeholder functions if not yet defined
const getMyGigs = async (req, res) => {
try {
    const gigs = await Gig.find({ createdBy: req.user.id });
    res.status(200).json(gigs);
  } catch (err) {
    res.status(500).json({ message: "❌ Could not fetch your gigs", error: err.message });
  }};

const getGigsByFreelancer = async (req, res) => {
  // Add implementation here
};

module.exports = {
  createGig,
  getMyGigs,
  getAllGigs,
  getGigsByFreelancer
};
