const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongoErrors = require("mongoose-mongodb-errors");

const bodyparser = require("body-parser");
const path = require("path");

const stripe = require("stripe")(Secret_Key);

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// View Engine Setup
app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");
mongoose.Promise = global.Promise;
mongoose.plugin(mongoErrors);

const route = require("./routes/routes");

app.use("/uploads", express.static("./uploads"));
app.use("/new", route);
app.get("/", async function (req, res) {
  const params = {
    email: "syeddvrock@gmail.com",
    name: "osama",
    description: "hello",
  };

  const customer = await stripe.customers.create(params);
  const customers = await stripe.customers.list({
    email: "syeddvrock@gmail.com",
  });

  const card = await stripe.customers.createSource(customer.id, {
    source: "tok_visa",
  });

  const reward = await stripe.paymentIntents.create({
    payment_method: card.id,
    customer: customer.id,
    amount: 5000,
    currency: "usd",
    payment_method_types: ["card"],
  });

  res.render("Home", {
    secret: reward.client_secret,
    list: customers,
    paymentId: reward.id,
  });
});
app.get("/refund", async function (req, res) {
  const refund = await stripe.refunds.create({
    payment_intent: "pi_3KNuu9LdRkVXjaBC26nEjDfl",
    amount: 30,
  });
  res.send(refund.amount + "is returned");
});
app.get("/cancel", async function (req, res) {
  const paymentIntent = await stripe.paymentIntents.cancel(
    "pi_3KNuzyLdRkVXjaBC0O3lX5uj"
  );
  res.send(paymentIntent.amount + " is returned");
});

app.use("*", (req, res, next) => {
  req.status = 404;
  const error = new Error("Route not found");
  res.status(error.status || 500).send({
    message: error.message,
    stack: error.stack,
  });
  next();
});



mongoose
  .connect(
    "mongodb://login:1234@cluster0-shard-00-00.45cqn.mongodb.net:27017,cluster0-shard-00-01.45cqn.mongodb.net:27017,cluster0-shard-00-02.45cqn.mongodb.net:27017/login?ssl=true&replicaSet=atlas-12eqzo-shard-0&authSource=admin&retryWrites=true&w=majoritymongodb://login:1234@cluster0-shard-00-00.45cqn.mongodb.net:27017,cluster0-shard-00-01.45cqn.mongodb.net:27017,cluster0-shard-00-02.45cqn.mongodb.net:27017/login?ssl=true&replicaSet=atlas-12eqzo-shard-0&authSource=admin&retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("db connection sucessfull");
  });

app.listen("3000", () => {
  console.log("connected");
});
