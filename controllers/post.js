const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Post = require("../models/Posts");

// @desc Create new post
// @route POST /api/v1/posts
exports.createPost = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const { title, description } = req.body;

  if (!title || !description) {
    return next(new ErrorResponse("Please provide title and description", 400));
  }

  const post = await Post.create(req.body);

  res.status(201).json({
    success: true,
    data: post,
  });
});

// @desc Delete post
// @route DELETE /api/v1/posts/:id
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is post owner
  if (post.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this post`,
        401
      )
    );
  }

  await post.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc Like post
// @route PUT /api/v1/posts/like/:id
exports.likePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if the post has already been liked
  if (post.likes.includes(req.user.id)) {
    return next(new ErrorResponse("Post already liked", 400));
  }

  post.likes.push({
    id: req.user.id,
    name: req.user.name,
  });
  await post.save();

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc Unlike post
// @route PUT /api/v1/posts/unlike/:id
exports.unlikePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  if (!post.likes.includes(req.user.id)) {
    return next(new ErrorResponse("Post has not yet been liked", 400));
  }

  post.likes = post.likes.filter((like) => like !== req.user.id);

  await post.save();

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc Get all posts
// @route GET /api/v1/posts
exports.getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts,
  });
});

// @desc Get single post
// @route GET /api/v1/posts/:id
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc Create new comment
// @route POST /api/v1/posts/comment/:id
exports.createComment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) {
    return next(new ErrorResponse("Please provide text", 400));
  }

  const post = await Post.findById(id);
  console.log(post);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  console.log(req.user);

  const newComment = {
    text,
    user: req.user.id,
    name: req.user.name,
  };

  post.comments.unshift(newComment);

  await post.save();

  res.status(201).json({
    success: true,
    data: post,
  });
});
