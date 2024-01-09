import express, { Router } from "express";
import {
  cart,
  homepage,
  homepage1,
  login,
  logoutUser,
  productpage,
  register,
} from "../services/userRender.js";
import {
  isUser,
  newuser,
  otp,
  productpageshow,
} from "../controller/userController.js";

import { addToCart } from "../controller/cartController.js";
// import userAuth from '../middleware/authMiddleware.js';

const router = Router();

router.get("/", homepage);
router.get("/homepage1", homepage1);

router.get("/login", login);
router.get("/logout", logoutUser);
router.get("/register", register);
router.get("/productpage/:id", productpage);
router.get("/cart",cart);



//API

router.post("/api/registeruser", newuser);
router.post("/api/login", isUser);
router.post("/api/addtocart",addToCart);


router.get("/api/productpageshow", productpageshow);

router.post("/verifyotp", otp);

export default router;
