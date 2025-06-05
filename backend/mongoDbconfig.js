import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
function connectDb() {
  mongoose.set("strictQuery", true);
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  mongoose
    .connect(process.env.DATABASE_URL, options)
    .then(() => {
      console.log("connected");
    })
    .catch((e) => {
      console.error(e);
    });
}

export default connectDb;
