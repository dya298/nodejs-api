const createHttpError = require("http-errors");
const JWT = require("jsonwebtoken");

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secretKey = process.env.ACCESS_TOKEN;
      const options = {
        expiresIn: "10s",
        issuer: "tranduy030700@gmali.com",
        audience: userId
      };
      JWT.sign(payload, secretKey, options, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createHttpError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.headers.authorization) {
      return next(createHttpError.Unauthorized());
    }
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    console.log(bearerToken);
    JWT.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createHttpError.Unauthorized(message));
      }
      req.payload = payload;
      next();
    });
  },
  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secretKey = process.env.REFRESH_TOKEN;
      const options = {
        expiresIn: "10d",
        issuer: "tranduy030700@gmali.com",
        audience: userId
      };
      JWT.sign(payload, secretKey, options, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createHttpError.InternalServerError());
        }
        resolve(token);
      });
    });
  }
};