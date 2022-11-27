const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

require("dotenv").config();
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.icyspqk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const laptopCollection = client.db("laptops").collection("category");
    const bookingCollection = client.db("laptops").collection("bookings");
    const userCollection = client.db("laptops").collection("users");
    const advertiseCollection = client.db("laptops").collection("advertise");
    const reportCollection = client.db("laptops").collection("report");

    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { category_Id: id };
      const result = await laptopCollection.find(query).toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Laptop server running");
});

app.listen(port, () => {
  console.log(`Laptop Server listening on port ${port}`);
});