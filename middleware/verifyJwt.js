const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401); //unauthorized

  const token = authHeader.split(" ")[1];
  if (!token) return res.sendStatus(403); //forbidden
  console.log(token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded.userInfo.username;
    req.roles = decoded.userInfo.roles;
    console.log(req.user, decoded.username);
    next();
  });
};
module.exports = verifyJwt;
