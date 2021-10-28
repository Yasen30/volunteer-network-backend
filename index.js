const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.i5gnt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("volunteer-network");
    const eventsCollection = database.collection("events");
    const myEventsCollection = database.collection("myEvents");
    // services post
    app.get("/events", async (req, res) => {
      const cursor = eventsCollection.find();
      const services = await cursor.toArray();
      res.send(services);
    });
    // my events post
    app.post("/my-event", async (req, res) => {
      const info = req.body;
      const resutl = await myEventsCollection.insertOne(info);
      res.json(resutl);
    });
    // my events get
    app.get("/my-events", async (req, res) => {
      const curosor = myEventsCollection.find();
      const result = await curosor.toArray();
      res.send(result);
    });
    // my events delete
    app.delete("/my-events/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: ObjectId(id) };
      const result = await myEventsCollection.deleteOne(qurey);
      res.json(result);
    });
    console.log("database connect");
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("<h1>This is Volunteer network server</h1>");
});

app.listen(port, () => {
  console.log("sucessfully by run", port);
});
