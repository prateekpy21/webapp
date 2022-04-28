const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Position = db.position;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (req.body.position) {
      Position.find(
        {
          name: { $in: req.body.position }
        },
        (err, position) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          user.position = position.map(position => position._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Position.findOne({ name: "user" }, (err, position) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        user.position = [position._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};
exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("position", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      var authorities = [];
      for (let i = 0; i < user.positions.length; i++) {
        authorities.push("POSITION_" + user.positions[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        position: authorities,
        accessToken: token
      });
    });
};