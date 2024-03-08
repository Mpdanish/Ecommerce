import mongoose from "mongoose";
import Wishlistdb from "../model/wishlistSchema.js";

export async function addToWishlist(req, res) {
  try {
    let userId = req.session.userId;
    if (!userId) {
      return res.status(200).json({ message: "Please Login" });
    }

    const { productId } = req.body;

    const dup = await Wishlistdb.findOne({
      userId: userId,
      "products.productId": productId,
    });

    if (dup) {
      return res.status(200).json({ message: "Product already in wishlist" });
    }

    const wishlist = await Wishlistdb.updateOne(
      { userId: req.session.userId },
      {
        $push: { products: { productId: productId } },
      },
      { upsert: true }
    );


    res.status(200).json({ message: "Product added to wishlist" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function removeFromWishlist(req, res) {
  try {
    const { id } = req.body;
    console.log(id);

    // Remove the product from the user's cart
    const data = await Wishlistdb.updateOne(
      { userId: req.session.userId },
      { $pull: { products: { id } } }
    );
    console.log(data);
    res
      .status(200)
      .json({ message: "Product removed from the wishlist successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
}
