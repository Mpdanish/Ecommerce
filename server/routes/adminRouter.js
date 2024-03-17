import express, { Router } from "express";
import {
  addCategoryOffer,
  addProductOffer,
  adminAddCoupon,
  adminAddProduct,
  adminCategory,
  adminCoupon,
  adminDeletedCoupon,
  adminDeletedProduct,
  adminEditCategory,
  adminEditCoupon,
  adminEditProduct,
  adminOrder,
  adminProduct,
  adminUnlistedCategory,
  adminUser,
  adminlogin,
  editOffer,
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
import { CategoryOffer, ProductOffer, deleteOffer, updateOffer } from "../controller/offerController.js";
import { addCoupon, deleteCoupon, updateCoupon } from "../controller/couponController.js";
import { customDateSales } from "../controller/salesReportController.js";
import { adminDashboard, getDetailsChart } from "../controller/dashboardController.js";


const router = Router();

router.get("/adminlogin", adminlogin);
router.get("/adminlogout", logoutAdmin);
router.get("/adminHome",checkAdmin, adminDashboard);
router.get("/adminUsers",checkAdmin, adminUser);
router.get("/adminProducts",checkAdmin, adminProduct);
router.get("/adminDeletedProducts",checkAdmin, adminDeletedProduct);
router.get("/adminCategory",checkAdmin, adminCategory);
router.get("/adminEditCategory/:id",checkAdmin, adminEditCategory)
router.get("/adminUnlistedCategory",checkAdmin, adminUnlistedCategory);
router.get("/adminOrder",checkAdmin, adminOrder);
router.get("/adminAddProduct",checkAdmin, adminAddProduct);
router.get("/adminEditProduct/:id",checkAdmin, adminEditProduct);
router.get("/offer",checkAdmin, offer);
router.get("/addCategoryOffer",checkAdmin, addCategoryOffer);
router.get("/addProductOffer",checkAdmin, addProductOffer);
router.get("/editoffer/:id",checkAdmin, editOffer);
router.get("/adminCoupon",checkAdmin, adminCoupon ); //checkAdmin,
router.get("/adminAddCoupon",checkAdmin, adminAddCoupon ); //checkAdmin,
router.get("/editCoupon/:id",checkAdmin, adminEditCoupon); //checkAdmin,
router.get("/adminDeletedCoupons",checkAdmin, adminDeletedCoupon); //checkAdmin,


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
router.post("/updateOrderStatus", updateorder)
router.post("/addCategoryOffer", CategoryOffer)
router.post('/getproductname', getProductData)
router.post('/addProductOffer', ProductOffer)
router.post('/addCoupon', addCoupon)
router.post('/generateSalesReport', customDateSales)
router.post('/getChartData', getDetailsChart)


router.put("/api/updateproduct/:id", updateproduct);
router.put("/api/updatecategory/:id", updatecategory);
router.put("/updateOffer/:id", updateOffer);
router.patch("/updateCoupon/:id", updateCoupon);

router.delete("/deleteimage/:id/:productid", deleteImage)
router.delete("/deleteoffer/:id", deleteOffer)
router.delete("/deleteCoupon/:id", deleteCoupon)

export default router;
