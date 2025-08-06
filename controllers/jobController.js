const Job = require("../models/Job");

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find(); 
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs", error: error.message });
  }
};

module.exports = {
  getAllJobs,
};
