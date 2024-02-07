import express, { Router } from "express";
import {
  addaddress,
  cart,
  editaddress,
  homepage,
  login,
  orderinfo,
  orderslist,
  otppage,
  productlist,
  productpage,
  profile,
  register,
  showaddress,
} from "../services/userRender.js";
import {
  addAddress,
  filterproduct,
  isUser,
  logoutUser,
  newuser,
  otp,
  updateaddress,
  updateprofile,
} from "../controller/userController.js";

import { addToCart, removeFromCart, removeproductfromcart } from "../controller/cartController.js";
// import userAuth from '../middleware/authMiddleware.js';

const router = Router();

router.get("/", homepage);
// router.get("/homepage1", homepage1);

router.get("/login", login);
router.get("/logout",logoutUser);
router.get("/register", register);
router.get("/product/:id", productpage);
router.get("/cart", cart);
router.get("/checkout");
router.get("/profile", profile);
router.get("/address", showaddress);
router.get("/addaddress", addaddress)
router.get("/editaddress/:id", editaddress );
router.get("/otp", otppage );
router.get("/orders", orderslist)
router.get("/orderinformation", orderinfo)
router.get("/products",productlist)


//API

router.post("/api/registeruser", newuser);
router.post("/api/login", isUser);
router.post("/api/addtocart", addToCart);
router.post("/api/removeFromCart", removeFromCart );
router.post("/api/addaddress", addAddress );
router.post("/updateprofile",updateprofile );
router.put("/api/updateaddress",updateaddress )
router.delete("/removeProduct", removeproductfromcart)
router.get('/api/products',filterproduct)


router.post("/verifyotp", otp);

export default router;
