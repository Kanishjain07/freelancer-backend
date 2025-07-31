const Job = require("../models/Job");

exports.recordPayment = async (req, res) => {
  try {
    const { freelancerId, amount } = req.body;
    const clientId = req.user.id;

    console.log("📩 Payment request:", { clientId, freelancerId, amount });

    if (!freelancerId || !amount) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Simulate payment recording
    await Job.create({
      clientId,
      freelancerId,
      price: Number(amount),
       isFilled: true,  
      isCompleted: true,
    });

    res.status(201).json({ message: "Payment recorded" });
  } catch (error) {
    console.error("❌ Backend Payment Error:", error.message);
    res.status(500).json({ message: "Failed to record payment", error: error.message });
  }
};
