import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userdb",
      required: true,
    },
    orderDetails: [
      {
        pName: {
          type: String,
          required: true,
        },
        pImage: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        address: {
          type: String,
          required: true,
        },
        paymentMethod: {
          type: String,
          required: true,
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "productdb",
          required: true,
        },

        orderStatus: {
          type: String,
          default: "Ordered",
          required: true,
        },
        orderDate: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    totalsum: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Orderdb = mongoose.model("orderdb", orderSchema);

export default Orderdb;
