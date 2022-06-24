const { logEvents } = require("./logEvents");

const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}\t${err.message}`, "errLog.txt");
  console.error(err.stack);
  res.status(500).send("Access not allowed by CORS!");
};

module.exports = errorHandler;
