import Cartdb from "../model/cartSchema.js";
import Productdb from "../model/productSchema.js";

export async function addToCart(req, res) {
  try {
    // console.log("hfgh");

    let userId = req.session.userId;

    // console.log(userId);
    // console.log(req.session);

    const { id, quantity } = req.body;
    // console.log(req.body);

    console.log("productid : ", id, "quantity :", quantity);

    const productId = id;

    // console.log(productId);

    let cart = await Cartdb.findOne({ userId });

    // console.log(cart);

    if (!cart) {
      cart = await Cartdb.create({ userId });
    }

    const itemIndex = cart.products.findIndex((p) => p.productId === productId);
    if (itemIndex > -1) {
      cart.products[itemIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    let saved = await cart.save();
    console.log(saved);
    res.send(cart);
  } catch (err) {
    console.error(err);
    res.send("Error adding product to cart");
  }
}
