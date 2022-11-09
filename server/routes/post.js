const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const postController = require("../controller/post.controller");
const Post = require("../models/Post");

router.get("/allpost", requireLogin, postController.getAllPosts);

router.post("/createpost", requireLogin, postController.postCreatePost);

router.get("/mypost", requireLogin, postController.getMyPost);

router.put("/like", requireLogin, postController.like);

router.put("/unlike", requireLogin, postController.unlike);

router.put("/comment", requireLogin, postController.comments);

router.get("/comment", postController.getAllComments);

router.delete("/deletePost/:postId", requireLogin, (req, res) => {
  let postId = req.params.postId;
  Post.findOne({ _id: postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            console.log(result);
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

module.exports = router;
