const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../key");
const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports.postSignUp = (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  if (!name || !email || !password) {
    return res.status(422).json({ error: "Please add all the field" });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.status(422).json({ error: "User already existed" });
      }

      bcrypt.hash(password, 12).then((hashedPassword) => {
        const userSign = new User({ name, email, password: hashedPassword });

        userSign
          .save()
          .then((newUser) => {
            if (newUser) {
              res.json({
                // user: newUser,
                message: "Sign up successfully",
              });
            }
          })
          .catch((error) => {
            console.log("Save failed: " + error);
          });
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports.postSignIn = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({
      error: "Please add email or password",
    });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).json({
          error: "Email not found or invalid",
        });
      } else if (user) {
        bcrypt
          .compare(password, user.password)
          .then((result) => {
            if (!result) {
              return res.status(422).json({
                error: "Password is incorrect",
              });
            } else {
              const token = jwt.sign({ _id: user._id }, JWT_SECRET);

              return res.json({
                token,
                message: "Login successful",
                user: {
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                },
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
