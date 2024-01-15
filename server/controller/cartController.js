import Cartdb from "../model/cartSchema.js";
import Productdb from "../model/productSchema.js";

export async function addToCart(req, res) {
  try {
    let userId = req.session.userId;

    const { id, quantity } = req.body;

    const productId = id;

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
    res.status(200).send(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}


export async function removeFromCart(req, res) {
  try {
    const itemIdToRemove = parseInt(req.body.itemId, 10);

    cart = Cartdb.filter(item => item.id !== itemIdToRemove);

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

