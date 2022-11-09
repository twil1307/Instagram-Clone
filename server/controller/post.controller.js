const Post = require("../models/Post");

module.exports.postCreatePost = (req, res) => {
  const { title, body, url } = req.body;
  console.log("url: " + url);
  if (!title) {
    return res.status(422).json({ error: "Please enter title" });
  }
  if (!body) {
    return res.status(422).json({ error: "Please enter body" });
  }
  if (!url) {
    return res.status(422).json({ error: "Please add image" });
  }
  req.user.password = undefined;
  const newPost = new Post({
    title,
    body,
    photo: url,
    postedBy: req.user,
  });

  newPost
    .save()
    .then((post) => {
      console.log(post);
      return res.json({
        post,
        message: "create new post successfully",
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports.getAllPosts = function (req, res) {
  // Post.find({ postedBy: { $ne: req.user._id } })
  Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((post) => {
      console.log(post);
      return res.json(post);
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports.getMyPost = (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.like = (req, res) => {
  console.log(req.body.postId);
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $addToSet: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .then((post) => {
      res.json(post);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.unlike = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .then((post) => {
      res.json(post);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.comments = (req, res) => {
  let comment = {
    content: req.body.content,
    postedBy: req.user._id,
  };
  console.log(comment);
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: {
        comments: comment,
      },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")

    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
};

module.exports.getAllComments = (req, res) => {
  Post.find()
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .then((posts) => {
      res.json(posts);
    })
    .then((results) => {
      console.log(results);
    })
    .catch((err) => {
      console.log(err);
    });
};
