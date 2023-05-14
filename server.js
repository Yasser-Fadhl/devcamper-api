require("colors");
const express = require("express");
const connectDB = require("./config/db");
const bootCamps = require("./routes/bootcamps");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const app = express();

connectDB();

//Body parser
app.use(express.json());
app.use("/api/v1/bootcamps", bootCamps);

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
