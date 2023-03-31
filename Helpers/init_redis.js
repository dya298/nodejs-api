// const redis = require("redis");

// const client = redis.createClient({
//   url: process.env.REDIS_URI
// });

// (async () => {
//   await client.connect();
//   await client.SET("hello", "bar");
// })();

// client.on("connect", () => {
//   console.log("Client connected to redis");
// });

// client.on("error", (err) => {
//   console.log(err.message);
// });

// client.on("ready", () => {
//   console.log("Client connected to redis and ready to use");
// });

// client.on("end", () => {
//   console.log("Client disconnected to redis");
// });

// process.on("SIGINT", () => {
//   client.quit();
// });

// module.exports = client;
