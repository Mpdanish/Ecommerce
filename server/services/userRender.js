const axios = require("axios");
const session = require('express-session')
const Userdb = require('../model/userSchema')

require('dotenv').config()


//Register User Page
exports.register = (req, res) => {
    res.render('userSignup.ejs')
  };

  // Login Page
// exports.login = (req, res) => {
//     axios.get(`http://localhost:3000/api/users?email=${req.session.email}`)
//     .then(function (response) {
//         console.log(response.data);
//       res.render('userLogin.ejs', { users: response.data });
//     })
//     .catch((err) => {
//       res.send(err);
//     });
//   };

exports.login = (req, res) => {
  req.session.emailIsValid = false;
  res.render("userLogin.ejs", { isValidate: req.session.isValidate });
};


  //logout for home user
exports.logout = (req, res) => {
    req.session.isauth = false;
    axios.get(`http://localhost:3000/api/logout?email=${req.query.email}`).then()
    req.session.email = ''
    res.redirect("/login");
  };


