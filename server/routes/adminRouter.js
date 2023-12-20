const express = require('express')
const router = express.Router()

const adminServices = require('../services/adminRender')
const adminController = require('../controller/adminController')




router.get('/adminlogin', adminServices.adminlogin)
router.post('/adminlogin', adminServices.isAdmin);
router.get("/adminlogout", adminServices.logoutAdmin);
router.get("/adminHome", adminServices.adminHome);
router.get("/adminUsers", adminServices.adminUser);
router.get("/adminProducts", adminServices.adminProduct);
router.get("/adminCategory", adminServices.adminCategory);
router.get("/adminOrder", adminServices.adminOrder);
router.get("/adminAddProduct", adminServices.adminAddProduct);
router.get("/adminEditProduct", adminServices.adminEditProduct);



//API


router.get("/api/adminUser", adminController.adminUser);
router.get("/api/blockuser", adminController.blockuser);
router.get("/api/unblockuser", adminController.unblockuser);
router.post("/api/addcategory", adminController.addcategory);
router.get("/api/adminshowCategoty", adminController.adminshowcategory);
router.post("/api/addproduct", adminController.addproduct);




module.exports = router