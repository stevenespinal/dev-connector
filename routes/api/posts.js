const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const {check, validationResult} = require("express-validator");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
const mongoose = require("mongoose");

router.post("/", [auth, [
  check('text', 'Text is required.').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  try {
    const user = await User.findById(req.user.id).select('-password');
    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    });

    const post = await newPost.save();

    return res.json(post);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error.");
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find({}).sort({date: -1});
    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Send Error.");
  }
});


router.get("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) return res.status(404).json({message: "Post not found."});
    return res.json(post);
  } catch (err) {
    console.error(err.message);
    if (!mongoose.Types.ObjectId.isValid(req.params.post_id))
      return res.status(404).json({message: 'Post not found.'});

    res.status(500).send("Send Error.");
  }
});

router.delete("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({message: "Post not found."});
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({message: "User not authorized."});
    }
    await post.remove();
    return res.json({message: "Post removed."});

  } catch (err) {
    console.error(err.message);
    if (!mongoose.Types.ObjectId.isValid(req.params.post_id))
      return res.status(404).json({message: 'Post not found.'});

    res.status(500).send("Send Error.");
  }
});

router.put("/like/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({message: "Post already liked."});
    }

    post.likes.unshift({user: req.user.id});
    await post.save();
    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error.");
  }
});

router.put("/unlike/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({message: "Post has not yet been liked."});
    }

    post.likes = post.likes.filter(
      (like) => like.user.toString() !== req.user.id
    );

    await post.save();
    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error.");
  }
});


router.post("/comment/:id", [auth, [
  check('text', 'Text is required.').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id);

    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    };

    post.comments.unshift(newComment);
    await post.save();

    return res.json(post.comments);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error.");
  }
});


router.delete("/comment/:post_id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    const comment = post.comments.find(comm => comm.id === req.params.comment_id);

    if (!comment) {
      return res.status(404).json({message: "Comment does not exist."});
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({message: "User not authorized"});
    }


    post.comments = post.comments.filter(
      ({id}) => id !== req.params.comment_id
    );

    await post.save();
    return res.json(post.comments);

  } catch (err) {
    console.error(err.message);
    if (!mongoose.Types.ObjectId.isValid(req.params.post_id))
      return res.status(404).json({message: 'Post not found.'});

    res.status(500).send("Server Error.");
  }
});

module.exports = router;
