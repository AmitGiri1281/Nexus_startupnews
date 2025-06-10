const Bookmark = require('../models/Bookmark');

exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id });
    res.status(200).json({ success: true, data: bookmarks });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.addBookmark = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const bookmark = await Bookmark.create(req.body);
    res.status(201).json({ success: true, data: bookmark });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    
    if (!bookmark) {
      return res.status(404).json({ success: false, message: 'Bookmark not found' });
    }

    if (bookmark.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await bookmark.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};