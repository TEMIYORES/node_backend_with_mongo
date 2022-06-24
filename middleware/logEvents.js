const { format } = require("date-fns");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (msg, fileName) => {
  const dateTime = `${format(new Date(), "yyyy-MM-dd\tHH:mm:ss")}`;
  const logMessage = `${dateTime}\t${uuid()}\t${msg}\n`;
  console.log(logMessage);

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", fileName),
      logMessage
    );
  } catch (err) {
    console.error(err);
  }
};

// custom middleware
const logger = (req, res, next) => {
  console.log(`${req.url}\t${req.method}`);
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url} `, "reqLogs.txt");
  next();
};
module.exports = { logger, logEvents };
