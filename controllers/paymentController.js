const Job = require("../models/Job");
const Payment = require("../models/payment"); 

exports.recordPayment = async (req, res) => {
  try {
    const { freelancerId, amount, jobId } = req.body;
    const clientId = req.user.id;

    console.log("📩 Payment request:", { clientId, freelancerId, amount, jobId });

    // ✅ Validate required fields
    if (!freelancerId || !amount || !jobId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // ✅ Create Payment record
    const payment = new Payment({
      clientId,
      freelancerId,
      jobId,
      amount: Number(amount),
    });

    await payment.save();

    // ✅ Update related job as completed & filled
    await Job.findByIdAndUpdate(jobId, {
      isCompleted: true,
      isFilled: true,
    });

    res.status(201).json({ message: "Payment recorded", payment });
  } catch (error) {
    console.error("❌ Backend Payment Error:", error.message);
    res.status(500).json({ message: "Failed to record payment", error: error.message });
  }
};
