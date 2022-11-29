const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");

const { loadPlanetsData } = require("./models/planets.model");

const port = process.env.PORT || 8000;

const MONGO_URL =
  "mongodb+srv://Sujan-Pradhan:HHM1N1xg8qX4fqf1@cluster0.wdropew.mongodb.net/nasa?retryWrites=true&w=majority";

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify : false,
    // useCreateIndex: true
  });
  await loadPlanetsData();

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();

// Benefits => organize the code a little more
