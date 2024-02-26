import express, { Router } from "express";
import {
  addCategoryOffer,
  addProductOffer,
  adminAddOffer,
  adminAddProduct,
  adminCategory,
  adminDeletedProduct,
  adminEditCategory,
  adminEditProduct,
  adminHome,
  adminOffer,
  adminOrder,
  adminProduct,
  adminUnlistedCategory,
  adminUser,
  adminlogin,
  isAdmin,
  logoutAdmin,
  offer,
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
  updateorder,
  getProductData,
} from "../controller/adminController.js";
import { checkAdmin } from "../middleware/adminAuth.js";
import { addOffer } from "../controller/offerController.js";

const router = Router();

router.get("/adminlogin", adminlogin);
router.get("/adminlogout", logoutAdmin);
router.get("/adminHome",checkAdmin, adminHome);
router.get("/adminUsers",checkAdmin, adminUser);
router.get("/adminProducts",checkAdmin, adminProduct);
router.get("/adminDeletedProducts",checkAdmin, adminDeletedProduct);
router.get("/adminCategory",checkAdmin, adminCategory);
router.get("/adminEditCategory/:id",checkAdmin, adminEditCategory)
router.get("/adminUnlistedCategory",checkAdmin, adminUnlistedCategory);
router.get("/adminOrder",checkAdmin, adminOrder);
router.get("/adminAddProduct",checkAdmin, adminAddProduct);
router.get("/adminEditProduct/:id",checkAdmin, adminEditProduct);
router.get("/adminOffers",checkAdmin, adminOffer)
router.get("/adminAddOffer",checkAdmin, adminAddOffer)
router.get("/offer",checkAdmin, offer)
router.get("/addCategoryOffer",checkAdmin, addCategoryOffer)
router.get("/addProductOffer",checkAdmin, addProductOffer)

router.post("/adminlogincheck", isAdmin);

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
router.post("/updateOrderStatus",updateorder)
router.post("/addoffer", addOffer )
router.post('/getproductname',getProductData)

router.put("/api/updateproduct/:id", updateproduct);
router.put("/api/updatecategory/:id", updatecategory);

router.delete("/deleteimage/:id/:productid", deleteImage)

export default router;
