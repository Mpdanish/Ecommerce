import express, { Router } from "express";
import {
  addaddress,
  cart,
  editaddress,
  forgotPass,
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
  wishlist,
} from "../services/userRender.js";
import {
  addAddress,
  addToWallet,
  changepassowrd,
  deleteaddress,
  filterproduct,
  forgotPassEmailVerify,
  isUser,
  logoutUser,
  newuser,
  otp,
  resendOtp,
  updateaddress,
  updateprofile,
  walletRazorpayVerification,
} from "../controller/userController.js";

import { addToCart, reloadTotalAmount, removeproductfromcart, updatequantity } from "../controller/cartController.js";
import { cancelOrder, checkaddress, checkout, invoiceDownload, orderRazorpayVerification, placeorder, returnOrder } from "../controller/orderController.js";
import { checkBlocked, dontgoback, } from "../middleware/userAuth.js";
import { addToWishlist, removeFromWishlist } from "../controller/wishlistController.js";
import { checkCoupon } from "../controller/couponController.js";

const router = Router();

router.get("/", homepage); //checkBlocked, checkSession,
router.get("/home",checkBlocked, homepage); //checkBlocked, checkSession,
router.get("/login",dontgoback, login);
router.get("/logout", logoutUser);
router.get("/register", register);
router.get("/forgotPassword", forgotPass);
router.get("/404page", pagenotfound);
router.get("/successpage",checkBlocked, successpage)
router.get("/product/:id", productpage);
router.get("/cart", cart);
router.get("/wishlist", wishlist);
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
router.post("/forgotPassEmailVerify",forgotPassEmailVerify)
router.post("/api/addtocart", addToCart);
router.post("/addToWishlist", addToWishlist);
router.post("/api/addaddress", addAddress );
router.post("/api/checkCoupon", checkCoupon );
router.post("/updateprofile",updateprofile );

router.put("/api/updateaddress",updateaddress )

router.delete("/removeProduct", removeproductfromcart)
router.delete("/removeFromWishlist", removeFromWishlist)
router.delete("/deleteaddress/:id",deleteaddress);


router.get('/api/products',filterproduct)
router.get('/getUpdatedTotalAmount',reloadTotalAmount)
router.get('/checkaddress',checkaddress)
router.get('/generate-invoice/:id', invoiceDownload)

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
