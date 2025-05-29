import mongoose from "mongoose";

function connectDb() {
  const connectStr = "mongodb://localhost:27017/Thinkmail";
  mongoose.set("strictQuery", true);
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  mongoose
    .connect(connectStr, options)
    .then(() => {
      console.log("connected");
    })
    .catch((e) => {
      console.error(e);
    });
}

export default connectDb;
