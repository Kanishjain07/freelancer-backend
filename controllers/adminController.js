const User = require("../models/User");
const Gig = require("../models/Gig"); // ✅ Required for getAllGigs & deleteGig
const Payment = require("../models/payment"); // ✅ Required for getAllPayments
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Admin login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Not an admin" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, message: "Admin login successful" });
  } catch (err) {
    console.error("❌ Admin login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all non-admin users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } });
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all gigs
exports.getAllGigs = async (req, res) => {
  try {
    const gigs = await Gig.find();
    res.json(gigs);
  } catch (err) {
    console.error("❌ Error fetching gigs:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (err) {
    console.error("❌ Error fetching payments:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete gig by ID
exports.deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findByIdAndDelete(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    res.json({ message: "Gig deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting gig:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};