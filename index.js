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
    app.get("/category", async (req, res) => {
      const category = req.query.category;
      const query = { category: category };
      const result = await laptopCollection.find(query).toArray();
      res.send(result);
    });
    // post method for bookings
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });
    // get method for advertise
    app.get("/advertise", async (req, res) => {
      const query = {};
      const products = await advertiseCollection.find(query).toArray();
      res.send(products);
    });
    // get method for orders
    app.get("/myOrders", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const bookings = await bookingCollection.find(query).toArray();
      res.send(bookings);
    });

    // get method for users
    app.get("/users", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const users = await userCollection.find(query).toArray();
      res.send(users);
    });
    // get method for users
    app.get("/buyers", async (req, res) => {
      const role = req.query.role;
      const query = { role: role };
      const users = await userCollection.find(query).toArray();
      res.send(users);
    });
    // jwt method for
    app.get("/jwt", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      if (user) {
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
          expiresIn: "1d",
        });
        return res.send({ accessToken: token });
      }
      res.status(403).send({ accessToken: "" });
    });

    // post for add product
    app.post("/addProduct", async (req, res) => {
      const review = req.body;
      const result = await laptopCollection.insertOne(review);
      res.send(result);
    });
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await userCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await laptopCollection.deleteOne(filter);
      res.send(result);
    });
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(filter);
      res.send(result);
    });

    // post for users method
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    // post method for report item
    app.post("/report", async (req, res) => {
      const report = req.body;
      const result = await reportCollection.insertOne(report);
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