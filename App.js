const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Authrouter = require("./routes/auth");

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use("/api/v1", Authrouter);

app.get("/", (req, res) => {
  res.status(201).send("Server Ping");
});

const database = "mongodb+srv://shrutikasaudagar2400:nNbGqaKRxZdUrbvG@cluster0.ogd0z6l.mongodb.net/parlour?retryWrites=true&w=majority&appName=Cluster0";
const port = 5002;
mongoose
  .connect(database)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  })
  .catch((error) => console.log(`ERROR: ${error.message}`));
