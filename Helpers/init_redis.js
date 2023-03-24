const redis = require("redis");

const client = redis.createClient({
  host: "127.0.0.1",
  port: 6379
});

client.on("connect", () => {
  console.log("Client connected to redis");
});

client.on("error", (err) => {
  console.log(err.message);
});

client.on("ready", () => {
  console.log("Client connected to redis and ready to use");
});

client.on("end", () => {
  console.log("Client disconnected to redis");
});

process.on("SIGINT", () => {
  client.quit();
});

module.exports = client;
