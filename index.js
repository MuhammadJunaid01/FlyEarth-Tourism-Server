const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oisx1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("mongo pass and name", uri);
async function run() {
  try {
    await client.connect();
    const database = client.db("FlyEarth");

    const Tour_packeges = database.collection("Tour_packeges");
    const specialoffer = database.collection("specialoffer");
    const AddOrders = database.collection("AddOrders");
    const ConfirmOrder = database.collection("ConfirmOrder");
    const orders = database.collection("orders");
    const Addhotel = database.collection("Addhotel");
    app.get("/tourpackeges", async (req, res) => {
      const query = {};
      const cursor = Tour_packeges.find(query);
      const result = await cursor.toArray();
      res.json(result);
    });
    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await Tour_packeges.findOne(query);
      // console.log(result);
      res.json(result);
    });
    // booking post api
    app.post("/orders", async (req, res) => {
      console.log("hitted the orders post api");
      const order = req.body;
      const result = await orders.insertOne(order);
      // console.log(result);
      res.json(result);
    });
    // get offer api
    app.get("/specialOffer", async (req, res) => {
      const query = {};
      const cursor = specialoffer.find(query);
      const result = await cursor.toArray();
      res.json(result);
    });
    // order get post api some
    app.get("/ordersumary", async (req, res) => {
      const query = {};
      const cursor = orders.find(query);
      const result = await cursor.toArray();
      res.json(result);
    });
    // add order
    app.post("/addorder", async (req, res) => {
      console.log("add order post hitted:", req.body);
      const order = req.body;
      const result = await AddOrders.insertOne(order);
      res.json(result);
    });
    app.get("/myorders/:email", async (req, res) => {
      console.log("hitted my orders", req.params.email);

      const cursor = AddOrders.find({ email: req.params.email });
      const result = await cursor.toArray();
      // console.log(result);
      res.json(result);
    });
    // confirm order api
    app.post("/confimorder", async (req, res) => {
      console.log("confirm order api hitted");
      const order = req.body;
      console.log(order);
      const result = await ConfirmOrder.insertOne(order);
      // console.log("confirm ", result);
      res.json(result);
    });
    app.get("/confimorder", async (req, res) => {
      const query = {};
      const cursor = ConfirmOrder.find(query);
      const result = await cursor.toArray();
      // console.log("confirm orders", result);
      res.json(result);
    });
    // manage delete api
    app.delete("/delete/:id", async (req, res) => {
      console.log("hitted delete ");
      // console.log("delete hitted", req.params.id);
      const id = req.params.id;
      console.log(id);
      const query = { _id: req.params.id };
      const result = await ConfirmOrder.deleteOne(query);
      console.log("delete success", result);
      res.json(result);
    });

    // add hotel
    app.post("/addhotel", async (req, res) => {
      console.log("confirm order api hitted");
      const order = req.body;
      console.log(order);
      const result = await Addhotel.insertOne(order);
      // console.log("confirm ", result);
      res.json(result);
    });
    // add hotel get api
    app.get("/addhotel", async (req, res) => {
      const query = {};
      const cursor = Addhotel.find(query);
      const result = await cursor.toArray();
      // console.log(result);
      res.json(result);
    });
    // delete operation
    // app.delete("/orderCanceled/:id", async (req, res) => {
    //   const id = req.params.id;
    //   console.log("iiiiiid", id);
    //   const query = { _id: ObjectId(id) };
    //   const result = await AddOrders.deleteOne(query);

    //   console.log("deleting user with id ", result);

    //   // res.json("delete", result);
    // });
  } finally {
    // await client.close();
  }
}
app.get("/helo", (req, res) => {
  res.send("hello testing api");
});
app.get("/", (req, res) => {
  res.send("Fly Earth server is runnig ");
});
run().catch(console.dir);
app.listen(port, () => {
  console.log("server is runnig the port", port);
});
