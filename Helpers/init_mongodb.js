const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => console.log(err.message));

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to db");
});

mongoose.connection.on("error", (err) => {
  console.log(err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconted");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
