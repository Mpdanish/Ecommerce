import express, { Router } from "express";
import {
  homepage,
  homepage1,
  login,
  productpage,
  register,
} from "../services/userRender.js";
import { isUser, newuser, otp } from "../controller/userController.js";
// import userAuth from '../middleware/authMiddleware.js';

const router = Router();

router.get("/", homepage);
router.get("/homepage1", homepage1);

router.get("/login", login);
// router.get("/logout", logout);
router.get("/register", register);
router.get("/productpage", productpage);

//API

router.post("/api/registeruser", newuser);
router.post("/api/login", isUser);
router.post("/verifyotp", otp);

export default router;
