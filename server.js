const express = require("express");
// const morgan = require("morgan");
const createError = require("http-errors");
const morgan = require("morgan");
const authRouter = require("./Routers/Auth/auth");
const userRouter = require("./Routers/User/user");
const noteRouter = require("./Routers/Notes/notes");
const schema = require("./schema");
const { graphqlHTTP } = require("express-graphql");
const { verifyAccessToken } = require("./Helpers/jwt");

// connect dotenv
require("dotenv").config();
// connect mongodb
require("./Helpers/init_mongodb");

// require("./Helpers/init_redis");

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

// auth request
app.use("/auth", authRouter);
// user request
app.use("/user", userRouter);

app.use("/note", noteRouter);

app.use("/graphql", verifyAccessToken, graphqlHTTP({
  schema,
  graphiql: true
}));

// set up error callback
app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  });
});
