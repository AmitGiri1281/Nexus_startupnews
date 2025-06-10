const express = require("express");
const router = express.Router();

// Dummy analytics data for testing
router.get("/", (req, res) => {
  res.json({
    totalUsers: 123,
    activeUsers: 56,
    newSignupsToday: 7,
  });
});

module.exports = router;
