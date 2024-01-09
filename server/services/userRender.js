import session from "express-session";
import userSchema from "../model/userSchema.js";
import Productdb from "../model/productSchema.js";
import "dotenv/config";
import Cartdb from "../model/cartSchema.js";
import mongoose from "mongoose";

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
    req.session.emailIsValid = false;
    res
      .status(200)
      .render("userLogin.ejs", { isValidate: req.session.isValidate });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function homepage(req, res) {
  try {
    const data = await Productdb.find();
    res.status(200).render("homePage.ejs", { product: data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function homepage1(req, res) {
  try {
    const data = await Productdb.find();
    res.status(200).render("homePage1.ejs", { product: data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function logoutUser(req, res) {
  try {
    req.session.destroy();
    const data = await Productdb.find();
    res.status(200).render("homePage.ejs", { product: data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

// //logout for home user
// export function logout  (req, res)  {
//   req.session.isauth = false;
//   axios.get(`http://localhost:${process.env.PORT}/api/logout?email=${req.query.email}`).then()
//   req.session.email = ''
//   res.redirect("/login");
// };

//   export async function UserProduct  (req, res)  {
//     const data=await Productdb.find()
//     res.render('homePage.ejs',{product:data});

// };

export async function productpage(req, res) {
  try {
    const data = await Productdb.findOne({ _id: req.params.id });
    res.status(200).render("productpage.ejs", { product: data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function cart(req, res) {
  try {
    const userid = req.session.userId;

    const data = await Cartdb.aggregate([
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

    res.status(200).render("userCart.ejs", { products: data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
