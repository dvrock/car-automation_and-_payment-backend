const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

module.exports = {
  Authenticate: async (req, res, next) => {
    try {
      const verify = req.headers["authorization"];
      if (!verify) return res.status(401).json({ message: "unauthorized" });
      const bearer = verify.split(" ");
      req.token = bearer[1].split("///")[0];
      jwt.verify(req.token, "secret", function (err, decoded) {
        if (err) {
          console.log(err.message);
          if (err.message == "jwt expired") {
            req.token = bearer[1].split("///")[1];
            jwt.verify(req.token, "secret", function (err, decoded) {
              req.user_id = decoded.id;
              next();
            });
          } else {
            req.user_id = decoded.id;
            next();
          }
        }
      });
    } catch (err) {
      res.status(400);
    }
  },
};
