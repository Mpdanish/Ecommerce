import Productdb from "../model/productSchema.js";
import "dotenv/config";
import Cartdb from "../model/cartSchema.js";
import mongoose from "mongoose";
import Userdb from "../model/userSchema.js";
import Addressdb from "../model/addressSchema.js";
import Categorydb from "../model/categorySchema.js";
import Orderdb from "../model/orderSchema.js";

//Register User Page
export function register(req, res) {
  try {
    res.status(200).render("userSignup.ejs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export function login(req, res) {
  try {
    req.session.status = true;
    res.status(200).render("userLogin.ejs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function homepage(req, res) {
  try {
    const product = await Productdb.find({ isHidden: false }).limit(3);
    const user = req.session.userId;
    res.status(200).render("homePage.ejs", { product, user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function otppage(req, res) {
  try {
    res.status(200).render("otpentry.ejs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function profile(req, res) {
  try {
    const user = await Userdb.findById({ _id: req.session.userId });
    res.status(200).render("userProfile.ejs", { user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function showaddress(req, res) {
  try {
    let user = req.session.userId;
    const address = await Addressdb.find({ userId: user });
    res.status(200).render("showaddress.ejs", { address });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function addaddress(req, res) {
  try {
    res.status(200).render("addAddress.ejs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function editaddress(req, res) {
  try {
    req.session.addressId = req.params.id;
    const address = await Addressdb.findOne({ _id: req.session.addressId });
    res.status(200).render("editAddress.ejs", { address });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function productpage(req, res) {
  try {
    const data = await Productdb.findOne({ _id: req.params.id });
    const userid = req.session.userId;

    const userdata = await Userdb.findById(userid);
    res
      .status(200)
      .render("productpreview.ejs", { product: data, user: userdata });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function cart(req, res) {
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

    console.log(products);

    // const sum = products[0].products.quantity * products[0].productsDetails.price
    const sum = products.reduce((total, product) => {
      // Ensure product and productDetails exist
      if (product.products && product.productsDetails) {
        total += product.products.quantity * product.productsDetails.price;
      }
      return total;
    }, 0);

    // console.log(sum, "sum");

    // res.status(200).render("userCart.ejs", { products });
    res.status(200).render("cart.ejs", { products, sum });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function orderslist(req, res) {
  try {
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

    console.log(cartItems, "wert");

    const userid = req.session.userId;
    const orders = await Orderdb.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userid) },
      },
      { $unwind: "$orderDetails" },
    ]);
    console.log(orders);
    res.render("ordersList.ejs", { orders });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function orderinfo(req, res) {
  try {
    console.log(req.params.id);
    const proid = req.params.id;
    const details = await Orderdb.findOne(
      { "orderDetails._id": new mongoose.Types.ObjectId(proid) },
      { "orderDetails.$": 1, _id: 1, userId: 1 }
    );
    console.log(details, "123456");
    res.render("orderInfo.ejs", { details });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function productlist(req, res) {
  try {
    const products = await Productdb.find();
    const category = await Categorydb.find();
    res.render("productlist.ejs", { products, category });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
