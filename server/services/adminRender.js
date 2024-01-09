import session from "express-session";
import "dotenv/config";
import Productdb from "../model/productSchema.js";
import Categorydb from "../model/categorySchema.js";
import Userdb from "../model/userSchema.js";

const adminEmail = "admin@gmail.com";
const adminPassword = "1234";

export function adminlogin(req, res) {
  try {
    req.session.emailIsValid = false;
    res
      .status(200)
      .render("adminLogin.ejs", { isValidate: req.session.isValidate });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

//Post for admin
export function isAdmin(req, res) {
  try {
    const { email: inputEmail, password: inputPassword } = req.body;
    if (inputEmail === adminEmail && inputPassword === adminPassword) {
      req.session.isAuth = true;
      res.status(200).render("adminHome.ejs");
    } else {
      res.status(200).render("adminLogin.ejs");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

// post for admin page home
export function logoutAdmin(req, res) {
  try {
    req.session.destroy();
    res.status(200).render("adminLogin.ejs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export function adminHome(req, res) {
  try {
    res.status(200).render("adminHome.ejs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function adminUser(req, res) {
  try {
    const data = await Userdb.find();
    res.status(200).render("adminUsers.ejs", { user: data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function adminProduct(req, res) {
  try {
    const data = await Productdb.find();
    res.status(200).render("adminProducts.ejs", { product: data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function adminAddProduct(req, res) {
  try {
    const data = await Categorydb.find();
    res.status(200).render("adminAddProduct.ejs", { category: data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function adminEditProduct(req, res) {
  try {
    const product = await Productdb.findOne({ _id: req.params.id });
    res.status(200).render("adminEditProduct.ejs", { product });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export function adminOrder(req, res) {
  try {
    res.status(200).render("adminOrders.ejs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function adminCategory(req, res) {
  try {
    const data = await Categorydb.find();
    res.status(200).render("adminCategories.ejs", { category: data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function adminUnlistedCategory(req, res) {
  try {
    const data = await Categorydb.find();
    res.status(200).render("adminUnlistCategory.ejs", { category: data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
