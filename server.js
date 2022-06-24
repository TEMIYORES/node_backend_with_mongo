require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const verifyJwt = require("./middleware/verifyJwt");
const credentials = require("./middleware/credentials");
const connectDB = require("./config/mongoose");
const mongoose = require("mongoose");
// connect to mongoDB
connectDB();
// custom logger
app.use(logger);

// handles option credentials check - before CORS!
// and fetch cookie credentials requirement
app.use(credentials);
// Cross Origin Resource Sharing

app.use(cors(corsOptions));
// creating middlewares -inbuilt middleware, -custom middleware and third party middleware
// built-in middleware to handle urlencoded form data in other words form data.
app.use(express.urlencoded({ extended: false }));

//built-in middleware for json
app.use(express.json());

// middle-ware for cookies
app.use(cookieParser());
//built-in middleware to serve static files
app.use("/", express.static(path.join(__dirname, "public")));

//router handler
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use(verifyJwt);
app.use("/employees", require("./routes/api/employees"));

// PORT number
const PORT = process.env.PORT || 4000;

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("connected", () => {
  console.log("MongoDB connected");
  app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`);
  });
});
