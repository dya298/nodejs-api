const express = require("express");
// const morgan = require("morgan");
const createError = require("http-errors");
const morgan = require("morgan");
const { verifyAccessToken } = require("./Helpers/jwt");
const authRouter = require("./Routers/Auth/auth");
// connect dotenv
require("dotenv").config();
// connect mongodb
require("./Helpers/init_mongodb");
// connect redis
require("./Helpers/init_redis");

// set up app
const app = express();
const PORT = process.env.PORT || 3001;
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create init port server
app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});

app.get("/", verifyAccessToken, async (req, res, next) => {
  await res.send("hello");
});

// auth request
app.use("/auth", authRouter);

// set up error callback
app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});
