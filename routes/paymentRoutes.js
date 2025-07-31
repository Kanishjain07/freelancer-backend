const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { recordPayment } = require("../controllers/paymentController");

// Fix: use the correct function name from controller
router.post("/", auth, recordPayment);

module.exports = router;
