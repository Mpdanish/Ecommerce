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
  pagenotfound,
  productlist,
  productpage,
  profile,
  register,
  showaddress,
  successpage,
  wallet,
} from "../services/userRender.js";
import {
  addAddress,
  addToWallet,
  changepassowrd,
  deleteaddress,
  filterproduct,
  isUser,
  logoutUser,
  newuser,
  otp,
  resendOtp,
  updateaddress,
  updateprofile,
  walletRazorpayVerification,
} from "../controller/userController.js";

import { addToCart, reloadTotalAmount, removeFromCart, removeproductfromcart, updatequantity } from "../controller/cartController.js";
import { cancelOrder, checkaddress, checkout, orderRazorpayVerification, placeorder, returnOrder } from "../controller/orderController.js";
import { checkBlocked } from "../middleware/userAuth.js";

const router = Router();

router.get("/", homepage); //checkBlocked
// router.get("/homepage1", homepage1);

router.get("/login", login);
router.get("/logout", logoutUser);
router.get("/register", register);
router.get("/404page", pagenotfound);
router.get("/successpage",checkBlocked, successpage)
router.get("/product/:id", productpage);
router.get("/cart", cart);
router.get("/profile",checkBlocked, profile);
router.get("/address",checkBlocked, showaddress);
router.get("/addaddress",checkBlocked, addaddress)
router.get("/editaddress/:id",checkBlocked, editaddress );
router.get("/otp", otppage );
router.get("/orders", checkBlocked, orderslist)
router.get("/orderinformation/:id", checkBlocked, orderinfo)
router.get("/products", productlist)
router.get("/checkout",checkBlocked, checkout)
router.get("/wallet",checkBlocked, wallet)



//API

router.post("/api/registeruser", newuser);
router.post("/api/login", isUser);
router.post("/api/addtocart", addToCart);
router.post("/api/removeFromCart", removeFromCart );
router.post("/api/addaddress", addAddress );
router.delete("/deleteaddress/:id",deleteaddress)
router.post("/updateprofile",updateprofile );
router.put("/api/updateaddress",updateaddress )
router.delete("/removeProduct", removeproductfromcart)
router.get('/api/products',filterproduct)
router.get('/getUpdatedTotalAmount',reloadTotalAmount)
router.get('/checkaddress',checkaddress)
router.post('/placeorder',placeorder)
router.post('/cancelOrder',cancelOrder)
router.post('/returnOrder',returnOrder)
router.post('/changepassword',changepassowrd)
router.post("/updatequantity",updatequantity)
router.post("/verifyotp", otp);
router.post("/resendotp", resendOtp)
router.post("/verifyrazorpay", orderRazorpayVerification)
router.post("/addToWallet",addToWallet)
router.post("/walletRazorpay",walletRazorpayVerification)

export default router;
