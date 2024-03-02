import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  offer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "offerdb",
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
});

const Categorydb = mongoose.model("categorydb", categorySchema);

export default Categorydb;
