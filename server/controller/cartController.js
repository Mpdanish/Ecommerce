import Cartdb from "../model/cartSchema.js";
import Productdb from "../model/productSchema.js";
import mongoose from "mongoose";

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
    res
      .status(200)
      .json({ message: "Product removed from the cart successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
}

export async function updatequantity(req, res) {
  try {
    const { quantity, productId } = req.body;
    const data = await Cartdb.updateOne(
      { "products.productId": productId },
      { $set: { "products.$.quantity": quantity } }
    );

    const inventory = await Productdb.findOne({_id: productId})

    console.log(inventory);

    if(inventory.stock<quantity){
      return res.status(404).json({ message: "Out of Stock" });
    }

    const cart = await Cartdb.findOne({"products.productId":productId})

    const result = await Cartdb.aggregate([
      {
        $match: {
          "products.productId": new mongoose.Types.ObjectId(productId) 
        },
      },
      {
        $unwind: "$products",
      },
      {
        $lookup: {
          from: Productdb.collection.name,
          localField: "products.productId",
          foreignField: "_id",
          as: "productsDetails",
        },
      },
      {
        $unwind: "$productsDetails",
      },
    ]);


    // const sum = result[0].products.quantity * result[0].productsDetails.price
    // console.log(sum);

    res.send(true);
  } catch (error) {
    console.log(error);
  }
}


export async function reloadTotalAmount(req,res) {
  try {

    const userid = req.session.userId;

    const products = await Cartdb.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userid) },
      },
      {
        $unwind: "$products",
      },
      {
        $lookup: {
          from: Productdb.collection.name,
          localField: "products.productId",
          foreignField: "_id",
          as: "productsDetails",
        },
      },
      {
        $unwind: "$productsDetails",
      },
    ]);

    // const sum = products[0].products.quantity * products[0].productsDetails.price
    const sum = products.reduce((total, product) => {
      // Ensure product and productDetails exist
      if (product.products && product.productsDetails) {
        total += product.products.quantity * product.productsDetails.price;
      }
      return total;
    }, 0);
    
    res.status(200).json({ updatedTotalAmount: sum });

  } catch (error) {
    console.log(error);
  }
}