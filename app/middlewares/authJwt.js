const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Position = db.position;
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};
isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    Position.find(
      {
        _id: { $in: user.position }
      },
      (err, position) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        for (let i = 0; i < position.length; i++) {
          if (position[i].name === "admin") {
            next();
            return;
          }
        }
        res.status(403).send({ message: "Require Admin Position!" });
        return;
      }
    );
  });
};
isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    Position.find(
      {
        _id: { $in: user.position }
      },
      (err, position) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        for (let i = 0; i < position.length; i++) {
          if (position[i].name === "moderator") {
            next();
            return;
          }
        }
        res.status(403).send({ message: "Require Moderator Position!" });
        return;
      }
    );
  });
};
const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};
module.exports = authJwt;