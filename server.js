require("colors");
const express = require("express");
const fileupload = require("express-fileupload");
const mongoSanitizer = require("express-mongo-sanitize");
const helmet = require("helmet");
const Xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const bootCamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: "./config/config.env" });
const app = express();
//
const mongoose = require("mongoose");

//connectDB();

//Body parser
app.use(express.json());

//Sanitize Data
app.use(mongoSanitizer());

// Set Security headers
app.use(helmet());

// Prevent XSS attacks
app.use(Xss());

//Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
});
app.use(limiter);

//Prevent http params pollution
app.use(hpp());

app.use(cors());

// Cookie Parser
app.use(cookieParser());

//File Uploading
app.use(fileupload());

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

//routers
app.use("/api/v1/bootcamps", bootCamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

app.use(errorHandler);
const port = process.env.PORT || 8080;

mongoose
  .connect(process.env.REMOTE_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log(`Connected to MongoDB: `.cyan.underline.bold);
    app.listen(
      port,
      console.log(
        `Server is running on port ${port} in ${process.env.NODE_ENV} mode`.blue
          .bold
      )
    );
  })
  .catch((ex) => console.log(`Error: ${ex.message}`));

// const server = app.listen(
//   port,
//   console.log(
//     `Server is running on port ${port} in ${process.env.NODE_ENV} mode`.blue
//       .bold
//   )
// );

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
