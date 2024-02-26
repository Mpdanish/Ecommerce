import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
});

const Offerdb = mongoose.model("offerdb", offerSchema);

export default Offerdb;
