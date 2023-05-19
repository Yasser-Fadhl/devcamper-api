const fs = require("fs");
const mongoose = require("mongoose");
require("colors");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const BootcampSchema = require("./models/Bootcamp");

// connect to db
mongoose.connect(process.env.LOCAL_DB);

// Read Json Files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, `utf-8`)
);

// Import into DB
const importData = async () => {
  try {
    await BootcampSchema.create(bootcamps);
    console.log("Data has been imported Successfully".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
// delete into DB
const deleteData = async () => {
  try {
    await BootcampSchema.deleteMany();
    console.log("Data has been deleted Successfully".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
} else {
  console.error("Invalid Script".red);
}
