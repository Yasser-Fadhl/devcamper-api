require("colors");
const express = require("express");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const bootCamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: "./config/config.env" });
const app = express();

connectDB();

//Body parser
app.use(express.json());

//File Uploading
app.use(fileupload());

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

//routers
app.use("/api/v1/bootcamps", bootCamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

app.use(errorHandler);
const port = process.env.PORT || 8080;
const server = app.listen(
  port,
  console.log(
    `Server is running on port ${port} in ${process.env.NODE_ENV} mode`.blue
      .bold
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
