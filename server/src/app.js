const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const planetRouter = require("./routes/planets/planets.router");

const launchesRouter = require("./routes/launches/launches.router");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(morgan("combined")); //use for logging file
app.use(express.json()); // It parses incoming JSON requests and puts the parsed data in req.body
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/planets", planetRouter);
app.use("/launches", launchesRouter);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
