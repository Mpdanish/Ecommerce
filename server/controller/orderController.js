import Addressdb from "../model/addressSchema.js";
import Cartdb from "../model/cartSchema.js";
import Orderdb from "../model/orderSchema.js";
import Productdb from "../model/productSchema.js";
import mongoose from "mongoose";
import "dotenv/config";
import Userdb from "../model/userSchema.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import Walletdb from "../model/walletSchema.js";
import EasyInvoice from "easyinvoice";
import fs from "fs";

var instance = new Razorpay({
  key_id: process.env.RZP_KEY_ID,
  key_secret: process.env.RZP_KEY_SECRET,
});

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
    const { paymentMethod, address, price } = req.body;
    req.session.sum = price;

    // Check if address and paymentMethod are provided
    if (!paymentMethod || !address) {
      throw new Error("Payment method and address are required.");
    }

    if (paymentMethod === "Razorpay") {
      var instance = new Razorpay({
        key_id: process.env.RZP_KEY_ID,
        key_secret: process.env.RZP_KEY_SECRET,
      });

      req.session.paymentMethod = paymentMethod;
      req.session.address = address;

      var options = {
        amount: price * 100, // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11",
      };
      instance.orders.create(options, function (err, order) {
        return res.json({ order });
      });
    }

    if (paymentMethod !== "Razorpay") {
      res.status(200).json({ message: "Order placed successfully!" });
    }
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(400).json({ error: error.message });
  }
}

export async function orderRazorpayVerification(req, res) {
  try {
    const instance = new Razorpay({
      key_id: process.env.RZP_KEY_ID,
      key_secret: process.env.RZP_KEY_SECRET,
    });

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    const body_data = razorpay_order_id + "|" + razorpay_payment_id;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RZP_KEY_SECRET)
      .update(body_data)
      .digest("hex");

    const isValid = generated_signature === razorpay_signature;

    if (isValid) {
      let user = req.session.userId;

      const userId = await Userdb.findById(user);
      const currentDate = new Date();

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
          price: element.productsDetails.price * element.products.quantity,
          pImage: element.productsDetails.images[0],
          quantity: element.products.quantity,
          address: req.session.address,
          paymentMethod: req.session.paymentMethod,
          orderStatus: "Ordered",
          orderDate: currentDate,
        };
        return orderItem;
      });

      // Create a new order instance
      const newOrder = new Orderdb({
        userId: userId,
        orderDetails: orderItems,
        totalsum: req.session.sum,
      });

      // Save the order to the database
      await newOrder.save();

      delete req.session.address;
      delete req.session.sum;
      delete req.session.paymentMethod;

      await clearUserCart(req.session.userId);

      res.status(200).redirect("/successpage");
    }
  } catch (error) {
    // If there's an error, send an error response
    console.error("Error while verifying", error);
    res.status(500).send("Error verifiying razorpay payment");
  }
}

export async function cancelOrder(req, res) {
  const orderId = req.body.orderId;
  // console.log(orderId, "idd");

  try {
    // Find the order by ID
    const order = await Orderdb.findOneAndUpdate(
      { "orderDetails._id": orderId },
      { $set: { "orderDetails.$.orderStatus": "Cancelled" } },
      { projection: { "orderDetails.$": 1 } }
    );

    // Add the quantity back to product stock
    const product = await Productdb.findOneAndUpdate(
      { _id: order.orderDetails[0].productId },
      { $inc: { quantity: order.orderDetails[0].quantity } }
    );

    if (order.orderDetails[0].orderStatus == "Cancelled") {
      if (order.orderDetails[0].paymentMethod == "Razorpay") {
        const user = await Userdb.findOne({ _id: req.session.userId });
        if (!user) {
          throw new Error("User not found");
        }

        const refundorder = await Orderdb.aggregate([
          {
            $match: {
              userId: new mongoose.Types.ObjectId(req.session.userId),
            },
          },
          {
            $unwind: "$orderDetails",
          },
        ]);

        const amount =
          Number(refundorder[0].orderDetails.price) *
          Number(refundorder[0].orderDetails.quantity);

        await Walletdb.updateOne(
          { userId: req.session.userId },
          {
            $inc: { walletBalance: amount },
            $push: { transactions: { amount: amount, type: "+ CREDIT" } },
          },
          { upsert: true }
        );
      }
    }

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
  // console.log(orderId, "idd");

  try {
    // Find the order by ID
    const order = await Orderdb.findOneAndUpdate(
      { "orderDetails._id": orderId },
      { $set: { "orderDetails.$.orderStatus": "Returned" } },
      { projection: { "orderDetails.$": 1 } }
    );
    // console.log(order, "orderr");

    // Add the quantity back to product stock
    const product = await Productdb.findOneAndUpdate(
      { _id: order.orderDetails[0].productId },
      { $inc: { quantity: order.orderDetails[0].quantity } }
    );

    if (order.orderDetails[0].orderStatus == "Delivered") {
      const user = await Userdb.findOne({ _id: req.session.userId });
      if (!user) {
        throw new Error("User not found");
      }

      const refundorder = await Orderdb.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(req.session.userId),
          },
        },
        {
          $unwind: "$orderDetails",
        },
      ]);

      const amount =
        Number(refundorder[0].orderDetails.price) *
        Number(refundorder[0].orderDetails.quantity);

      await Walletdb.updateOne(
        { userId: req.session.userId },
        {
          $inc: { walletBalance: amount },
          $push: { transactions: { amount: amount, type: "+ CREDIT" } },
        },
        { upsert: true }
      );
    }

    // console.log(product, "prodct");

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

    // console.log("User cart cleared successfully");
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

    // console.log(`Stock quantity decreased for product ${productId}`);
  } catch (error) {
    console.error("Error decreasing product stock:", error);
    // Handle error appropriately
  }
}

export async function generateInvoice(req, res) {
  try {
    const order = await Orderdb.findById(req.params.id);
    console.log(order);
    if (!order) {
      return res.status(404).send("Order not found");
    }

    // Create the invoice using EasyInvoice
    const data = {
      documentTitle: "Invoice",
      currency: "INR",
      taxNotation: "gst", // or gst
      marginTop: 25,
      marginBottom: 25,
      padding: 10,
      color: "#007BFF",
      logo: "/images/electronic-store-logo.svg", // or base64
      sender: {
        company: "OtronMart",
        address: "Street 123",
        zip: "459876",
        city: "Calicut",
        country: "India",
      },
      client: {
        company: "Client",
        address: order.orderDetails[0].address,
      },
      invoiceNumber: `Order #${order._id}`, // Use order ID as invoice number
      invoiceDate: order.orderDetails[0].orderDate.toLocaleDateString(), // Use order date as invoice date
      products: order.orderDetails.map((detail) => ({
        name: detail.pName,
        price: detail.price,
        quantity: detail.quantity,
      })),
      total: order.totalsum,
    };
    console.log(data);

    const result = await EasyInvoice.createInvoice(data);

    // Save invoice to a PDF file
    fs.writeFileSync("invoice.pdf", result.pdf, "base64");

    res.contentType("application/pdf");
    res.send(result.pdf);
  } catch (error) {
    console.error("error", error);
    res.status(500).send("Server Error");
  }
}

function generateInvoiceNumber() {
  return Math.floor(Math.random() * 1000000) + 1;
}

export async function invoiceDownload(req, res) {
  const orderId = req.params.id;
  try {
    const order = await Orderdb.findOne({ _id: orderId });

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"');

    doc.pipe(res);

    const invoiceNumber = generateInvoiceNumber();

    doc
      .font("Helvetica")
      .fontSize(24)
      .text("Fonekart", { align: "center" })
      .moveDown()
      .moveDown();
    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .text("INVOICE", { align: "start" })
      .moveDown();

    doc
      .fontSize(12)
      .text(`Invoice Number: ${invoiceNumber}`, { align: "start" })
      .moveDown();
    doc
      .fontSize(10)
      .text(`Order Date: ${order.orderDetails.orderDate.toDateString()}`, { align: "start" })
      .moveDown()
      .moveDown();

    doc.fontSize(12).text("BILLED TO :", { underline: true });
    doc.fontSize(10).text(`Name: ${order.orderDetails.address.name}`);
    doc
      .fontSize(10)
      .text(
        `Address: ${order.address.address}, ${order.address.city}, ${order.address.pin}`
      );

    const tableHeaders = [
      "Product Name",
      "Quantity",
      "Unit Price",
      "Total Price",
    ];

    const startX = 50;
    const startY = doc.y + 15;
    const cellWidth = 120;

    const headerHeight = 30;
    doc
      .rect(startX, startY, cellWidth * tableHeaders.length, headerHeight)
      .fillAndStroke("#CCCCCC", "#000000");
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#000000");
    tableHeaders.forEach((header, index) => {
      doc.text(
        header,
        startX + cellWidth * index + cellWidth / 2,
        startY + headerHeight / 2,
        { width: cellWidth, align: "start", valign: "start" }
      );
    });

    const rowHeight = 50;
    let yPos = startY + headerHeight;
    order.orderItems.forEach((item, rowIndex) => {
      const fillColor = rowIndex % 2 === 0 ? "#FFFFFF" : "#EEEEEE";
      doc
        .rect(startX, yPos, cellWidth * tableHeaders.length, rowHeight)
        .fillAndStroke(fillColor, "#000000");
      doc.fillColor("#000000");
      doc.font("Helvetica").fontSize(10);
      doc.text(
        item.Pname || "N/A",
        startX + cellWidth / 2,
        yPos + rowHeight / 2,
        { width: cellWidth, align: "start", valign: "start" }
      );
      doc.text(
        item.quantity.toString(),
        startX + cellWidth + cellWidth / 2,
        yPos + rowHeight / 2,
        { width: cellWidth, align: "start", valign: "start" }
      );
      doc.text(
        item.price !== undefined ? item.price.toString() : "N/A",
        startX + cellWidth * 2 + cellWidth / 2,
        yPos + rowHeight / 2,
        { width: cellWidth, align: "start", valign: "start" }
      );
      doc.text(
        item.price !== undefined && item.quantity !== undefined
          ? (item.price * item.quantity).toString()
          : "N/A",
        startX + cellWidth * 3 + cellWidth / 2,
        yPos + rowHeight / 2,
        { width: cellWidth, align: "start", valign: "start" }
      );
      yPos += rowHeight;
    });

    doc.moveDown(2);

    doc.end();
  } catch (error) {
    res.status(500).redirect("/500");
    console.error("Error generating invoice:", error);
  }
}
