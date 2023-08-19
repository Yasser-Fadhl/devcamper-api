const fs = require("fs");
const mongoose = require("mongoose");
require("colors");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const BootcampSchema = require("./models/Bootcamp");
const CourseSchema = require("./models/Course");
const UserSchema = require("./models/User");
const ReviewSchema = require("./models/Review");
// connect to db
mongoose.connect(process.env.REMOTE_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Read Json Files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, `utf-8`)
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, `utf-8`)
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, `utf-8`)
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, `utf-8`)
);

// Import into DB
const importData = async () => {
  try {
    await BootcampSchema.create(bootcamps);
    await CourseSchema.create(courses);
    await UserSchema.create(users);
    await ReviewSchema.create(reviews);
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
    await CourseSchema.deleteMany();
    await UserSchema.deleteMany();
    await ReviewSchema.deleteMany();
    console.log("Data has been deleted Successfully".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
//
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
} else {
  console.error("Invalid Script".red);
}
