const redis = require("redis");

const client = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: "redis-12197.c1.ap-southeast-1-1.ec2.cloud.redislabs.com",
    port: 12197
  }
});

(async () => {
  await client.connect();
})();

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
