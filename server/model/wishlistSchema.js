import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productdb",
        required: true,
      },
    },
  ],
});

const Wishlistdb = mongoose.model("wishlistdb", wishlistSchema);

export default Wishlistdb;
