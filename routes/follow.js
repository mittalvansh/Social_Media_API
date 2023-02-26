const express = require("express");
const { followUser, unfollowUser } = require("../controllers/follow");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.route("/follow/:id").put(protect, followUser);
router.route("/unfollow/:id").put(protect, unfollowUser);

module.exports = router;
