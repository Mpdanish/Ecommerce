import axios from 'axios';
import session from 'express-session';
import "dotenv/config"
import Productdb from '../model/productSchema.js';
import Categorydb from '../model/categorySchema.js';


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

  export function adminUser  (req, res)  {
      axios.get(`http://localhost:${process.env.PORT}/api/adminUser`).then((response)=>{
      res.render('adminUsers.ejs',{user:response.data});
      }).catch((err)=>{
        res.send(err)
      })
  };

  export async function adminProduct  (req, res)  {
        const data=await Productdb.find()
        res.render('adminProducts.ejs',{product:data});

  };

  export async function adminAddProduct  (req, res)  {
    const data=await Categorydb.find()
    res.render('adminAddProduct.ejs',{category:data});
  };
  
  export function adminEditProduct  (req, res)  {
    res.render('adminEditProduct.ejs');
  };

  export function adminOrder  (req, res)  {
    res.render('adminOrders.ejs');
  };
  
  export function adminCategory  (req, res)  {
    axios.get(`http://localhost:${process.env.PORT}/api/adminshowCategoty`).then((response)=>{
        res.render('adminCategories.ejs',{category:response.data});
      }).catch((err)=>{
        res.send(err)
      })
  };
  
  export function adminUnlistedCategory  (req, res)  {
    axios.get(`http://localhost:${process.env.PORT}/api/adminshowCategoty`).then((response)=>{
        res.render('adminUnlistCategory.ejs',{category:response.data});
      }).catch((err)=>{
        res.send(err)
      })
  };
