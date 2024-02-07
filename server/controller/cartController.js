import Cartdb from "../model/cartSchema.js";
import Productdb from "../model/productSchema.js";

export async function addToCart(req, res) {
  try {
    let userId = req.session.userId;
    if (!userId) {
      return res.status(200).json({ message: "Please Login" });
    }

    const { id, quantity } = req.body;

    const productId = id;
    // console.log(productId);
    // const same = await Cartdb.findOne({userId, 'products.productId': {productId}})
    const same = await Cartdb.findOne({
      userId: userId,
      "products.productId": productId,
    });

    // console.log(same, "same");
    if (same) {
      return res.status(200).json({ message: "Product already in cart" });
    }

    let cart = await Cartdb.findOne({ userId });

    if (!cart) {
      cart = await Cartdb.create({ userId });
    }

    const itemIndex = cart.products.findIndex((p) => p.productId === productId);
    if (itemIndex > -1) {
      cart.products[itemIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function removeFromCart(req, res) {
  try {
    const itemIdToRemove = parseInt(req.body.itemId, 10);

    cart = Cartdb.filter((item) => item.id !== itemIdToRemove);

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function removeproductfromcart(req, res) {
  try {
    // console.log(req.body);
    const { userId, productId } = req.body;

    // Remove the product from the user's cart
    const data = await Cartdb.updateOne(
      { userId },
      { $pull: { products: { productId } } }
    );
    console.log(data);
    res
      .status(200)
      .json({ message: "Product removed from the cart successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
}
