const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../key");
const User = require("../models/User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(401)
      .json({ error: "Invalid authorization - Please log in" });
  }

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "You must logged in" });
    }

    const idFind = decoded._id;
    console.log(idFind);
    User.findOne({ _id: idFind })
      .then((user) => {
        if (user) {
          req.user = user;
          next();
        } else {
          return res.status(422).json({ error: "Token not verified" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
