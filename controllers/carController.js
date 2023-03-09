const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const Rent = require("../models/rentSchema");
const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const Car = require("../models/carSchema");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const jwt = require("jsonwebtoken");
const Post = require("../models/postSchema");
const fs = require("fs");
const mail = require("../Email");
const mongoose = require("mongoose");

const db = mongoose.createConnection(
  "mongodb+srv://test:1234@cluster0.igkf7.mongodb.net/test?retryWrites=true&w=majority"
);
const stripe = require("stripe")(
  "sk_test_51KMAOtJNzPe8Mx71q6qStf2PEf2ICseKwhEiovAtOUogbMVnxZ4x1FlDufYQD1IpcVWsFV4rmNhvzWI4Cb5D4S9U00BugFJlZu"
);

module.exports = {
  Stripe: async (req, res) => {
    try {
      const updatePost = await User.updateOne(
        { _id: req.params.id },
        {
          $set: {
            verify: true,
          },
        }
      );
      const getUser = await User.findOne({ email });

      stripe.customers
        .create({
          email: "syeddrock@gmail.com",
          source: "234567890",
          name: "customer",
          address: {
            line1: "TC 9/4 Old MES colony",
            postal_code: "110092",
            city: "New Delhi",
            state: "lahore",
            country: "pakistan",
          },
        })
        .then((customer) => {
          return stripe.charges.create({
            amount: 7000, // Charing Rs 25
            description: "Web Development Product",
            currency: "USD",
            customer: "2345",
          });
        })
        .then((charge) => {
          res.send("Success"); // If no error occurs
        })
        .catch((err) => {
          res.send(err); // If some error occurs
        });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        success_url: "https://stripe.com/docs/api/subscriptions",
        cancel_url: "https://stripe.com/docs/api/subscriptions",
        customer_email: "syeddkrock@gmail.com",
        client_reference_id: "1234567",
        line_items: [
          {
            name: `Tour`,
            description: "any",
            amount: 1234,
            currency: "usd",
            quantity: 1,
          },
        ],
      });
      const verify = await bcrypt.compare(password, getUser.password);
      if (verify) {
        const token = jwt.sign({ id: getUser.id }, "secret", {
          expiresIn: "60s",
        });
        const requestToken = jwt.sign({ id: getUser.id }, "secret", {
          expiresIn: "1y",
        });

        res.status(201).json({
          status: "successfull",
          data: token,
          requestToken: requestToken,
          session,
        });
      } else {
        res.status(500).json({
          status: "500",
          data: "bad request",
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  },
  Register: async (req, res) => {
    try {
      const { username, email, password, DOB } = req.body;
      console.log(req.body);
      const encryptedPassword = await bcrypt.hash(password, 10);
      const session = await db.startSession();
      session.startTransaction();

      const newUser = await User.create({
        username,
        email,
        password: encryptedPassword,
        Profile_picture: `${req.file.filename}`,
        verify: false,
        DOB,
      });
      const user1 = User.findById();

      await session.commitTransaction();

      session.endSession();
      req.email = email;

      req.id = req.params.id;
      const value = {
        email: email,
        id: newUser._id,
      };

      mail.Message(value);

      const token = jwt.sign({ id: newUser._id }, "secret", {
        expiresIn: "60s",
      });
      const requestToken = jwt.sign({ id: newUser._id }, "secret", {
        expiresIn: "1y",
      });

      res.status(201).json({
        status: "successfull",
        data: token,
        requestToken: requestToken,
        userdata: newUser,
      });
    } catch (err) {
      res.status(500).send(err.message);
      session.abortTransaction();
    }
  },

  Login: async (req, res) => {
    try {
      const data1 = {
        sender_batch_header: {
          sender_batch_id: "Payouts_2018_100008",
          email_subject: "You have a payout!",
          email_message:
            "You have received a payout! Thanks for using our service!",
        },
        items: [
          {
            recipient_type: "EMAIL",
            amount: {
              value: "1.00",
              currency: "USD",
            },
            note: "Thanks for your patronage!",
            sender_item_id: "201403140001",
            receiver: "syeddkrock@gmail.com",

            notification_language: "fr-FR",
          },
        ],
      };

      const options = {
        url: "https://api.sandbox.paypal.com/v1/payments/payouts",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer A21AAIcxbWsjSln_lCIcXG74jhOvf-NFr2kMRUHUwmjvvGa6onpBNUw6QjzU-j2FqO0Y8Gs8z_H5lIvccEzOfMBx_Ylzf6g4Q`,
        },
        Object: data1,
        json: true,
      };
      res.post(options, function (err, httpResponse, body) {
        if (err) {
          console.error("Sending money failed:", err);
        } else {
          console.log(
            "Response from PayPal successful!  Server responded with:",
            body
          );

          //var payPalAnswer = JSON.parse(body);
        }
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  Home: async (req, res) => {
    try {
      const data1 = {
        sender_batch_header: {
          sender_batch_id: "Payouts_2018_100008",
          email_subject: "You have a payout!",
          email_message:
            "You have received a payout! Thanks for using our service!",
        },
        items: [
          {
            recipient_type: "EMAIL",
            amount: {
              value: "1.00",
              currency: "USD",
            },
            note: "Thanks for your patronage!",
            sender_item_id: "201403140001",
            receiver: "syeddkrock@gmail.com",

            notification_language: "fr-FR",
          },
        ],
      };

      const options = {
        url: "https://api.sandbox.paypal.com/v1/payments/payouts",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer A21AAIcxbWsjSln_lCIcXG74jhOvf-NFr2kMRUHUwmjvvGa6onpBNUw6QjzU-j2FqO0Y8Gs8z_H5lIvccEzOfMBx_Ylzf6g4Q`,
        },
        Object: data1,
        json: true,
      };
      req.post(options, function (err, httpResponse, body) {
        if (err) {
          console.error("Sending money failed:", err);
        } else {
          console.log(
            "Response from PayPal successful!  Server responded with:",
            body
          );

          //var payPalAnswer = JSON.parse(body);
        }
      });
    } catch (err) {
      console.log(err.message);
    }
  },

  getUsers: async (req, res) => {
    const getUsers = await User.find();
    res.status(201).json({
      data: getUsers,
      length: getUsers.length,
    });
  },

  updateUser: async (req, res) => {
    try {
      const { username, email, password, DOB } = req.body;
      const user1 = User.findById(req.params.id);
      fs.unlink("./uploads" + user1.Profile_picture, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          username,
          email,
          password,
          Profile_picture: `/uploads/${req.file.filename}`,
          verify: true,
          DOB,
        },
        { new: true }
      );

      res.status(201).json({
        data: post,
        message: "user post is updated",
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};
