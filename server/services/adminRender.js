import session from 'express-session';
import "dotenv/config"
import Productdb from '../model/productSchema.js';
import Categorydb from '../model/categorySchema.js';
import Userdb from '../model/userSchema.js';


const adminEmail = "admin@gmail.com";
const adminPassword = "1234";


  export function adminlogin  (req, res) {
    req.session.emailIsValid = false;
    res.render("adminLogin.ejs", { isValidate: req.session.isValidate });
  };

  //Post for admin
  export function isAdmin  (req, res)  {
    const { email: inputEmail, password: inputPassword } = req.body;
    if (inputEmail === adminEmail && inputPassword === adminPassword) {
      req.session.isAuth = true;
      res.render("adminHome.ejs");
    } else {
        res.render('adminLogin.ejs');
    }
  };
  
  // post for admin page home
  export function logoutAdmin  (req, res)  {
    req.session.destroy();
    res.render('adminLogin.ejs');
  };

  export function adminHome  (req, res)  {
    res.render('adminHome.ejs');
  };

  export async function adminUser  (req, res)  {
    const data=await Userdb.find()
      res.render('adminUsers.ejs',{user:data});
  };

  export async function adminProduct  (req, res)  {
        const data=await Productdb.find()
        res.render('adminProducts.ejs',{product:data});

  };

  export async function adminAddProduct  (req, res)  {
    const data=await Categorydb.find()
    res.render('adminAddProduct.ejs',{category:data});
  };
  
  export async function adminEditProduct  (req, res)  {
    const product=await Productdb.findOne({_id:req.params.id})
    res.render('adminEditProduct.ejs',{product});
  };

  export function adminOrder  (req, res)  {
    res.render('adminOrders.ejs');
  };
  
  export async function adminCategory  (req, res)  {
    const data=await Categorydb.find()
    res.render('adminCategories.ejs',{category:data});
  };
  
  export async function adminUnlistedCategory  (req, res)  {
    const data=await Categorydb.find()
    res.render('adminUnlistCategory.ejs',{category:data});
  };
