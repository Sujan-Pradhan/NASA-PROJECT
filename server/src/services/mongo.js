const mongoose = require('mongoose');

const MONGO_URL =
  "mongodb+srv://Sujan-Pradhan:HHM1N1xg8qX4fqf1@cluster0.wdropew.mongodb.net/nasa?retryWrites=true&w=majority";

  mongoose.connection.once("open", () => {
    console.log("MongoDB connection ready!");
  });
  
  mongoose.connection.on("error", (err) => {
    console.error(err);
  });

  async function mongoConnect(){
    await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify : false,
    // useCreateIndex: true
  });
}


async function mongoDisconnect() {
    await mongoose.disconnect()
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
}