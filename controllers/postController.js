const User = require("../models/userModel");
const Post = require("../models/postModel")
//finding one user by id middleware function
exports.findUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    req.profile = user;
    next();
  });
};

//middleware function to search a post by id
exports.findPostById = (req, res, next, id) => {
    Post.findById(id)
      .populate("category")
      .exec((err, post) => {
        if (err || !post) {
          return res.status(400).json({ error: "No Post found" });
        }
        req.post = post;
        next();
      });
  };
