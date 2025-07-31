const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

// ✅ Multer setup for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ Middleware: Verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// ✅ GET all jobs (Public)
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().populate("applicants.userId", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
});

// ✅ POST a new job (Client only)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    const job = new Job({
      title,
      description,
      budget,
      clientId: req.user.id,
    });

    await job.save();
    res.status(201).json({ message: "Job posted successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Failed to post job", error: err.message });
  }
});

// ✅ GET client-specific jobs
router.get("/my-jobs", verifyToken, async (req, res) => {
  try {
    const jobs = await Job.find({ clientId: req.user.id }).populate("applicants.userId", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
});


// ✅ DELETE a job (only owner can delete)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.clientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete job", error: err.message });
  }
});

// ✅ PATCH: Toggle job filled status
router.patch("/:id/toggle-filled", verifyToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.clientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    job.isFilled = !job.isFilled;
    await job.save();

    res.json({ message: `Job marked as ${job.isFilled ? "filled" : "open"}`, job });
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle filled", error: err.message });
  }
});

// ✅ PUT: Update a job
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.clientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, budget } = req.body;
    job.title = title;
    job.description = description;
    job.budget = budget;
    await job.save();

    res.json({ message: "Job updated successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Failed to update job", error: err.message });
  }
});

// ✅ POST /api/jobs/:id/apply (with optional resume)
router.post("/:id/apply", verifyToken, upload.single("resume"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const alreadyApplied = job.applicants.some(
      (app) => app.userId.toString() === req.user.id
    );
    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied" });
    }

    const resumePath = req.file ? `uploads/${req.file.filename}` : null;

    job.applicants.push({ userId: req.user.id, resume: resumePath });
    await job.save();

    res.status(200).json({ message: "Applied with resume!" });
  } catch (err) {
    res.status(500).json({ message: "Apply failed", error: err.message });
  }
});

module.exports = router;
