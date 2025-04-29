require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { serverHttp, app } = require("./socket/socket");
const userRoutes = require("./routes/users");
const gameRoutes = require("./routes/games");
const config = require("./database/configDB");

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-type"],
  })
);

app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);

mongoose
  .connect(config.mongoDb.uri)
  .then(() => console.log("Connection to MongoDB successful"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

serverHttp.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
const path = require("path");
const __DIRNAME = path.resolve();

app.use(express.static(path.join(__DIRNAME, "FRONT/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__DIRNAME, "FRONT", "dist", "index.html"));
});
