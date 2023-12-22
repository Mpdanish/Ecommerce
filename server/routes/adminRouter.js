import express,{ Router } from 'express';
import { adminAddProduct, adminCategory, adminEditProduct, adminHome, adminOrder, adminProduct, adminUnlistedCategory, adminUser, adminlogin, isAdmin, logoutAdmin } from '../services/adminRender.js';
import { addcategory, addproduct, adminUsers, adminshowcategory, blockuser, deleteCategory, restoreCategory, showproduct, unblockuser } from '../controller/adminController.js';
const router = Router();



router.get('/adminlogin', adminlogin)
router.post('/adminlogin', isAdmin);
router.get("/adminlogout", logoutAdmin);
router.get("/adminHome", adminHome);
router.get("/adminUsers", adminUser);
router.get("/adminProducts", adminProduct);
router.get("/adminCategory", adminCategory);
router.get("/adminUnlistedCategory", adminUnlistedCategory);
router.get("/adminOrder", adminOrder);
router.get("/adminAddProduct", adminAddProduct);
router.get("/adminEditProduct", adminEditProduct);



//API


router.get("/api/adminUser", adminUsers);
router.get("/api/blockuser", blockuser);
router.get("/api/unblockuser", unblockuser);
router.post("/api/addcategory", addcategory);
router.get("/api/deletecategory", deleteCategory);
router.get("/api/restorecategory", restoreCategory);
router.get("/api/adminshowCategoty", adminshowcategory);
router.post("/api/addproduct", addproduct);
router.post("/api/showproduct", showproduct);




export default router;