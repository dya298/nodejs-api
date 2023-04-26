const createHttpError = require("http-errors");
const JWT = require("jsonwebtoken");
const client = require("../Helpers/init_redis");

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secretKey = process.env.ACCESS_TOKEN;
      const options = {
        expiresIn: "1h",
        issuer: "tranduy030700@gmail.com",
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
  signEmailToken: (mail) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secretKey = process.env.ACCESS_TOKEN;
      const options = {
        issuer: "tranduy030700@gmail.com",
        audience: mail
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
      next(createHttpError.Unauthorized());
    }
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    JWT.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        next(createHttpError.Unauthorized(message));
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
        issuer: "tranduy030700@gmail.com",
        audience: userId
      };
      JWT.sign(payload, secretKey, options, async (err, token) => {
        if (err) {
          console.log(err.message);
          return reject(createHttpError.InternalServerError());
        }
        await client.set(userId, token, 10 * 24 * 60 * 60, (err, reply) => {
          if (err) {
            console.log(err.message);
            next(err);
          }
        });
        resolve(token);
      });
    });
  },
  veriftyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, payload) => {
        if (err) reject(createHttpError.Unauthorized());

        const useriD = payload.aud;
        const value = await client.get(useriD);
        if(value){
          if (refreshToken === value) resolve(useriD);
        }
        else{
          reject(createHttpError.Unauthorized()); 
        }
      });
    });
  }
};
