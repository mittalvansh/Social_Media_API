const express = require("express");
const {
  createPost,
  deletePost,
  likePost,
  unlikePost,
  getPosts,
  getPost,
  createComment,
} = require("../controllers/post");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.route("/").post(protect, createPost);
router.route("/like/:id").put(protect, likePost);
router.route("/unlike/:id").put(protect, unlikePost);
router.route("/:id").delete(protect, deletePost);
router.route("/").get(getPosts);
router.route("/:id").get(getPost);
router.route("/comment/:id").post(protect, createComment);

module.exports = router;
