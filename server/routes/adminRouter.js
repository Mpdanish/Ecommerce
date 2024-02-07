import express, { Router } from "express";
import {
  adminAddProduct,
  adminCategory,
  adminDeletedProduct,
  adminEditCategory,
  adminEditProduct,
  adminHome,
  adminOrder,
  adminProduct,
  adminUnlistedCategory,
  adminUser,
  adminlogin,
  isAdmin,
  logoutAdmin,
} from "../services/adminRender.js";
import {
  addcategory,
  addproduct,
  adminUsers,
  adminshowcategory,
  blockuser,
  deleteCategory,
  updateproduct,
  editproduct,
  restoreCategory,
  showproduct,
  unblockuser,
  deleteImage,
  restoreProduct,
  deleteProduct,
  updatecategory,
} from "../controller/adminController.js";

const router = Router();

router.get("/adminlogin", adminlogin);
router.get("/adminlogout", logoutAdmin);
router.get("/adminHome", adminHome);
router.get("/adminUsers", adminUser);
router.get("/adminProducts", adminProduct);
router.get("/adminDeletedProducts", adminDeletedProduct);
router.get("/adminCategory", adminCategory);
router.get("/adminEditCategory/:id", adminEditCategory)
router.get("/adminUnlistedCategory", adminUnlistedCategory);
router.get("/adminOrder", adminOrder);
router.get("/adminAddProduct", adminAddProduct);
router.get("/adminEditProduct/:id", adminEditProduct);

router.post("/adminlogin", isAdmin);

//API

router.get("/api/adminUser", adminUsers);
router.get("/api/blockuser", blockuser);
router.get("/api/unblockuser", unblockuser);
router.get("/api/editproduct", editproduct);
router.get("/api/adminshowCategoty", adminshowcategory);

router.post("/api/addcategory", addcategory);
router.post("/api/deletecategory", deleteCategory);
router.post("/api/restorecategory", restoreCategory);
router.post("/api/deleteproduct", deleteProduct);
router.post("/api/restoreproduct", restoreProduct);
router.post("/api/addproduct", addproduct);
router.post("/api/showproduct", showproduct);

router.put("/api/updateproduct/:id", updateproduct);
router.put("/api/updatecategory/:id", updatecategory);

router.delete("/deleteimage/:id/:productid", deleteImage)

export default router;
