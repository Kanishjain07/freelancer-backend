const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Protect all admin routes
router.get("/users", auth, adminController.getAllUsers);
router.get("/gigs", auth, adminController.getAllGigs);
router.get("/payments", auth, adminController.getAllPayments);

// Add optional routes like delete/update
router.delete("/user/:id", auth, adminController.deleteUser);
router.delete("/gig/:id", auth, adminController.deleteGig);

router.get("/admin/users", auth, admin, adminController.getAllUsers);
router.delete("/admin/user/:id", auth, admin, adminController.deleteUser);

module.exports = router;
