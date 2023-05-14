const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.LOCAL_DB);
  //.then(() => console.log(`Connected to MongoDB: `.cyan.underline.bold))
  // .catch((ex) => console.log(`Error: ${ex.message}`));
  console.log(
    `Connected to MongoDB: ${conn.connection.host} `.cyan.underline.bold
  );
};
module.exports = connectDB;
