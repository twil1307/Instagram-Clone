var express = require("express");
var router = express.Router();
var User = require("../models/User");
var Post = require("../models/Post");
const requireLogin = require("../middleware/requireLogin");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/:userId", (req, res) => {
  const userid = req.params.userId;
  User.findOne({ _id: userid })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: userid })
        .populate("postedBy", "_id name")

        .exec((err, posts) => {
          if (err) {
            return res.json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
});

router.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $addToSet: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }

      User.findByIdAndUpdate(
        req.user._id,
        {
          $addToSet: { following: req.body.followId },
        },
        {
          new: true,
        }
      )
        .then((result) => {
          return res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }

      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.followId },
        },
        {
          new: true,
        }
      )
        .then((result) => {
          return res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

module.exports = router;
