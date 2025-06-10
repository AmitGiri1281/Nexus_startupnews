const express = require('express');
const { protect } = require('../middlewares/auth');
const { getBookmarks, addBookmark, deleteBookmark } = require('../controllers/bookmarkController');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getBookmarks)
  .post(addBookmark);

router.route('/:id')
  .delete(deleteBookmark);

module.exports = router;