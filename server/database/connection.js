import mongoose from "mongoose";

function connectDB() {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.MONGO_URI)
    .then(console.log(`MongoDB connected`))
    .catch((err) => console.log(err));
}

export default connectDB;