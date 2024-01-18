import express, { Router } from "express";
import {
  cart,
  homepage,
  login,
  productpage,
  profile,
  register,
} from "../services/userRender.js";
import {
  isUser,
  logoutUser,
  newuser,
  otp,
} from "../controller/userController.js";

import { addToCart, removeFromCart } from "../controller/cartController.js";
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
router.get("/profile/:id", profile);

//API

router.post("/api/registeruser", newuser);
router.post("/api/login", isUser);
router.post("/api/addtocart", addToCart);
router.post("/api/removeFromCart", removeFromCart );


router.post("/verifyotp", otp);

export default router;
