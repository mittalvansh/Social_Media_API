const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// @desc Follow user
// @route PUT /api/v1/follow/:id
exports.followUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${id}`, 404));
  }

  // Make sure user is not following him
  if (user.followers.includes(req.user.id)) {
    return next(new ErrorResponse(`You are already following this user`, 400));
  }

  const new_user = await User.findByIdAndUpdate(
    req.user._id,
    { $push: { following: id } },
    { new: true, runValidators: true }
  );

  await User.findByIdAndUpdate(
    id,
    { $push: { followers: req.user.id } },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: new_user,
  });
});

// @desc Unfollow user
// @route PUT /api/v1/unfollow/:id
exports.unfollowUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${id}`, 404));
  }

  // Make sure user is following him
  if (!user.followers.includes(req.user.id)) {
    return next(new ErrorResponse(`You are not following this user`, 400));
  }

  const new_user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { following: id } },
    { new: true, runValidators: true }
  );

  await User.findByIdAndUpdate(
    id,
    { $pull: { followers: req.user.id } },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: new_user,
  });
});
