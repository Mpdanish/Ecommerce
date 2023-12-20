const axios = require("axios");
const session = require('express-session')

require('dotenv').config()


const adminEmail = "admin@gmail.com";
const adminPassword = "1234";


  exports.adminlogin = (req, res) => {
    req.session.emailIsValid = false;
    res.render("adminLogin.ejs", { isValidate: req.session.isValidate });
  };

  //Post for admin
  exports.isAdmin = (req, res) => {
    const { email: inputEmail, password: inputPassword } = req.body;
    if (inputEmail === adminEmail && inputPassword === adminPassword) {
      req.session.isAuth = true;
      res.render("adminHome.ejs");
    } else {
        res.render('adminLogin.ejs');
    }
  };
  
  // post for admin page home
  exports.logoutAdmin = (req, res) => {
    req.session.destroy();
    res.render('adminLogin.ejs');
  };

  exports.adminHome = (req, res) => {
    res.render('adminHome.ejs');
  };

  exports.adminUser = (req, res) => {
      axios.get(`http://localhost:${process.env.PORT}/api/adminUser`).then((response)=>{

        console.log(response);

        res.render('adminUsers.ejs',{user:response.data});

      })
  };

  exports.adminProduct = (req, res) => {
    res.render('adminProducts.ejs');
  };

  exports.adminAddProduct = (req, res) => {
    res.render('adminAddProduct.ejs');
  };
  
  exports.adminEditProduct = (req, res) => {
    res.render('adminEditProduct.ejs');
  };

  exports.adminOrder = (req, res) => {
    res.render('adminOrders.ejs');
  };
  
  exports.adminCategory = (req, res) => {
    axios.get(`http://localhost:${process.env.PORT}/api/adminshowCategoty`).then((response)=>{
        res.render('adminCategories.ejs',{category:response.data});
      }).catch(err=>{
        res.send(err)
      })
  };
