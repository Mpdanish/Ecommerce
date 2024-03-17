import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  couponCode: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  coupondiscount: {
    type: Number,
    required: true,
  },
  maxUse: {
    type: Number,
    required: true,
  },
  priceLimit: {
    type: Number,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Coupondb = mongoose.model("coupondb", couponSchema);

export default Coupondb;
