const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const Rent = require("../models/rentSchema");
const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const Car = require("../models/carSchema");
const jwt = require("jsonwebtoken");
const Post = require("../models/postSchema");
const fs = require("fs");
const mail = require("../Email");
module.exports = {
  Categories: async (req, res) => {
    try {
      const Cars = await Car.find({ available: "yes" });
      res.status(201).json({
        data: Cars,
        length: Cars.length,
      });
    } catch (err) {
      console.log(err);
    }
  },
  tourComplete: async (req, res) => {
    try {
      const name = req.body.carName;
      const updateCar = await Car.updateOne(
        { name: name },
        {
          $set: {
            available: "yes",
          },
        }
      );
      var d = new Date();

      const rentCars = await Rent.create({
        name,
        available: "Completed",
        startTime: d.getHours() + ":" + d.getMinutes(),
      });
      res.status(201).json({
        data: rentCars,
        message: "car tour is Completed",
      });
    } catch (err) {
      console.log(err);
    }
  },
  tourCancelled: async (req, res) => {
    try {
      const name = req.body.carName;
      console.log(name);
      const updateCar = await Car.updateOne(
        { name: name },
        {
          $set: {
            available: "yes",
          },
        }
      );
      var d = new Date();

      const rentCars = await Rent.create({
        name,
        available: "Canceled",
        endTime: d.getHours() + ":" + d.getMinutes(),
      });
      res.status(201).json({
        data: rentCars,
        message: "car is cancelled",
      });
    } catch (err) {
      console.log(err);
    }
  },
  Car: async (req, res) => {
    try {
      const name = req.body.name;
      console.log(name);
      const updateCar = await Car.updateOne(
        { name: name },
        {
          $set: {
            available: "no",
          },
        }
      );
      var d = new Date();

      const rentCars = await Rent.create({
        name,
        available: "inProgress",
        startTime: d.getHours() + ":" + d.getMinutes(),
      });
      res.status(201).json({
        data: rentCars,
        message: "user is updated",
      });
    } catch (err) {
      console.log(err);
    }
  },

  picUpdate: async (req, res) => {
    try {
      const users = await User.findById(req.user_id);
      console.log(req.user_id);
      fs.unlink("./uploads" + users.Profile_picture, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      const getUser = await User.updateOne(
        { _id: req.user_id },
        {
          $set: {
            Profile_picture: `${req.file.filename}`,
          },
        }
      );
      res.status(201).json({
        data: getUser,
        message: "user is updated",
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};
