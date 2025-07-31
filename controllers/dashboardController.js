// controllers/dashboardController.js
const Payment = require("../models/payment");
const Job = require("../models/Job");
const Gig = require("../models/Gig");

const getFreelancerStats = async (req, res) => {
  try {
    const freelancerId = req.user.id;

    const jobs = await Job.find({ freelancerId, isCompleted: true });

    const completedJobs = jobs.length;
    const totalEarnings = jobs.reduce((sum, j) => sum + (j.price || 0), 0);

    res.json({ completedJobs, totalEarnings });
  } catch (err) {
    console.error("❌ Error fetching freelancer stats:", err.message);
    res.status(500).json({ message: "Error fetching freelancer stats" });
  }
};

const getClientStats = async (req, res) => {
  try {
    const clientId = req.user.id;

    const jobs = await Job.find({ clientId });

    const totalJobs = jobs.length;
    const filledJobs = jobs.filter((j) => j.isFilled).length;
    const totalSpent = jobs
      .filter((j) => j.isFilled)
      .reduce((sum, j) => sum + (j.price || 0), 0);

    res.json({ totalJobs, filledJobs, totalSpent });
  } catch (err) {
    console.error("❌ Error getting client stats:", err.message);
    res.status(500).json({ message: "Failed to get stats" });
  }
};

module.exports = {
  getFreelancerStats,
  getClientStats,
};
