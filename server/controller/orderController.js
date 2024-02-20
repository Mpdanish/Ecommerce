import Addressdb from "../model/addressSchema.js";
import Cartdb from "../model/cartSchema.js";
import Orderdb from "../model/orderSchema.js";
import Productdb from "../model/productSchema.js";
import mongoose from "mongoose";
import Userdb from "../model/userSchema.js";

export async function checkout(req, res) {
  try {
    const userid = req.session.userId;

    const address = await Addressdb.find({ userId: userid });

    const productid = await Cartdb.findOne({
      userId: new mongoose.Types.ObjectId(userid),
    });

    // console.log(productid);

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

    // console.log(products);

    const sum = products.reduce((total, product) => {
      // Ensure product and productDetails exist
      if (product.products && product.productsDetails) {
        total += product.products.quantity * product.productsDetails.price;
      }
      return total;
    }, 0);

    res
      .status(200)
      .render("Checkout.ejs", { address, sum, products, productid });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).send("Error during checkout");
  }
}

export async function checkaddress(req, res) {
  try {
    // Fetch address data from the database
    const address = await Addressdb.findOne({ userId: req.session.userId });

    if (!address) {
      return res.status(404).json({ message: "No address found" });
    }

    res.json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function placeorder(req, res) {
  try {
    const { paymentMethod, address, totalsum, name, price, quantity, image } =
      req.body;
    console.log(req.body, "body");
    const sum = parseInt(totalsum);
    const totalprice = parseInt(price);
    const count = parseInt(quantity);

    const priceMatch = price.match(/₹(\d+)/);
    const quantityMatch = quantity.match(/(\d+)/);

    // Parse the matched values into numbers
    const pricee = priceMatch ? parseInt(priceMatch[1]) : 0;
    const quantityy = quantityMatch ? parseInt(quantityMatch[1]) : 0;

    // Check if address and paymentMethod are provided
    if (!paymentMethod || !address || !totalsum) {
      throw new Error("Payment method, address, and total sum are required.");
    }

    let user = req.session.userId;

    const userId = await Userdb.findById(user);
    const currentDate = new Date();
    const dateWithoutTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    const cartItems = await Cartdb.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(req.session.userId) },
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

    const orderItems = cartItems.map((element) => {
      const orderItem = {
        productId: element.products.productId,
        pName: element.productsDetails.name,
        price: element.productsDetails.price * quantityy,
        pImage: element.productsDetails.images[0],
        quantity: quantityy,
        address: address,
        paymentMethod: paymentMethod,
        orderStatus: "Ordered",
        orderDate: dateWithoutTime,
      };
      return orderItem;
    });

    // Create a new order instance
    const newOrder = new Orderdb({
      userId: userId,
      orderDetails: orderItems,
      totalsum: sum,
    });

    console.log(newOrder);

    // Save the order to the database
    await newOrder.save();

    await clearUserCart(req.session.userId);

    res.status(200).json({ message: "Order placed successfully!" });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(400).json({ error: error.message });
  }
}

export async function cancelOrder(req, res) {
  const orderId = req.body.orderId;
  console.log(orderId,"idd");

  try {
    // Find the order by ID
    const order = await Orderdb.findOneAndUpdate({"orderDetails._id": orderId}, {$set:{"orderDetails.$.orderStatus": "Cancelled"}},{projection: {"orderDetails.$": 1}});
    console.log(order,"orderr");
    

    // Add the quantity back to product stock
    const product = await Productdb.findOneAndUpdate(
      { _id: order.orderDetails[0].productId },
      { $inc: { quantity: order.orderDetails[0].quantity } }
    );

    console.log(product,"prodct");

    // Save the updated order
    // await res.save();

    // Send a success response
    res.status(200).send("Order cancelled successfully");
  } catch (error) {
    // If there's an error, send an error response
    console.error("Error cancelling order:", error);
    res.status(500).send("Error cancelling order");
  }
}

export async function returnOrder(req, res) {
  const orderId = req.body.orderId;
  console.log(orderId,"idd");

  try {
    // Find the order by ID
    const order = await Orderdb.findOneAndUpdate({"orderDetails._id": orderId}, {$set:{"orderDetails.$.orderStatus": "Returned"}},{projection: {"orderDetails.$": 1}});
    console.log(order,"orderr");
    

    // Add the quantity back to product stock
    const product = await Productdb.findOneAndUpdate(
      { _id: order.orderDetails[0].productId },
      { $inc: { quantity: order.orderDetails[0].quantity } }
    );

    console.log(product,"prodct");

    // Save the updated order
    // await res.save();

    // Send a success response
    res.status(200).send("Order returned successfully");
  } catch (error) {
    // If there's an error, send an error response
    console.error("Error returning order:", error);
    res.status(500).send("Error returning order");
  }
}

async function clearUserCart(userId) {
  try {
    // Find all cart items associated with the user
    const cartItems = await Cartdb.findOne({ userId: userId });
    // console.log(cartItems, "cartItems");
    // Loop through each cart item
    for (const cartItem of cartItems.products) {
      // Decrease the stock quantity of the product
      // console.log(cartItem, "zxcvb");
      await decreaseProductStock(cartItem.productId, cartItem.quantity);

      // Delete the cart item
      await Cartdb.findByIdAndDelete(cartItems._id);
    }

    console.log("User cart cleared successfully");
  } catch (error) {
    console.error("Error clearing user cart:", error);
    // Handle error appropriately
  }
}

async function decreaseProductStock(productId, quantity) {
  try {
    // Find the product by ID
    const product = await Productdb.findOne({ _id: productId });
    // console.log(productId, "asdfg");

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    // Decrease the stock quantity
    product.stock -= quantity;

    // Save the updated product
    await product.save();

    console.log(`Stock quantity decreased for product ${productId}`);
  } catch (error) {
    console.error("Error decreasing product stock:", error);
    // Handle error appropriately
  }
}
