import axios from 'axios';
import session from 'express-session';
import userSchema from '../model/userSchema.js';
import Productdb from '../model/productSchema.js';
import "dotenv/config"



//Register User Page
export function register  (req, res) {
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


export function login  (req, res)  {
  req.session.emailIsValid = false;
  res.render("userLogin.ejs", { isValidate: req.session.isValidate });
};

export async function homepage (req, res) {
  const data=await Productdb.find()
  res.render('homePage.ejs',{product:data})
}

export async function homepage1 (req, res) {
  const data=await Productdb.find()
  res.render('homePage1.ejs',{product:data})
}

  //logout for home user
  export function logout  (req, res)  {
    req.session.isauth = false;
    axios.get(`http://localhost:${process.env.PORT}/api/logout?email=${req.query.email}`).then()
    req.session.email = ''
    res.redirect("/login");
  };

//   export async function UserProduct  (req, res)  {
//     const data=await Productdb.find()
//     res.render('homePage.ejs',{product:data});

// };
