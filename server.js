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
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "TheCodebuzz API",
      version: "1.0.0",
      description: "Thecodebuzz test service to demo how to document your API",
      license: {
        name: "MIT",
        url: "https://thecodebuzz.com"
      },
      contact: {
        name: "TheCodeBuzz",
        url: "https://thecodebuzz.com",
        email: "infoATthecodebuzz.com"
      }
    },
    servers: [
      {
        url: "http://localhost:3000/"
      }
    ]
  },
  apis: ["./Routers/Notes/notes.js"]
};

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

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get(
  "/api-docs",
  swaggerUi.setup(swaggerSpec, {
    explorer: true
  })
);

// create init port server
app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});

// auth request
app.use("/auth", authRouter);
// user request
app.use("/user", userRouter);

app.use("/note", noteRouter);

app.use(
  "/graphql",
  verifyAccessToken,
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

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
