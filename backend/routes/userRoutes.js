const express = require('express');
const router = express.Router();

// Dummy route
router.get('/', (req, res) => {
  res.send('User route working!');
});

module.exports = router;
