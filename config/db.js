const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.REMOTE_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  //.then(() => console.log(`Connected to MongoDB: `.cyan.underline.bold))
  // .catch((ex) => console.log(`Error: ${ex.message}`));
  console.log(
    `Connected to MongoDB: ${conn.connection.host} `.cyan.underline.bold
  );
};
module.exports = connectDB;
