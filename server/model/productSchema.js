import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  images: {
    type: Array,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categorydb',
    required: true,
  },
  offer:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'offerdb',
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
});

const Productdb = mongoose.model("productdb", productSchema);

export default Productdb;
