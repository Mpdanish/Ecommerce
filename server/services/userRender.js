import Productdb from "../model/productSchema.js";
import "dotenv/config";
import Cartdb from "../model/cartSchema.js";
import mongoose from "mongoose";
import Userdb from "../model/userSchema.js";
import Addressdb from "../model/addressSchema.js";
import Categorydb, {  } from "../model/categorySchema.js";

//Register User Page
export function register(req, res) {
  try {
    res.status(200).render("userSignup.ejs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export function login(req, res) {
  try {
    req.session.emailIsValid = false;
    res
      .status(200)
      .render("userLogin.ejs", { isValidate: req.session.isValidate });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function homepage(req, res) {
  try {
    const product = await Productdb.find({ isHidden: false }).limit(3);
    const user = req.session.userId;
    res.status(200).render("homePage.ejs", { product, user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function otppage(req, res) {
  try {
    res.status(200).render("otpentry.ejs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function profile(req, res) {
  try {
    const user = await Userdb.findById({ _id: req.session.userId });
    res.status(200).render("userProfile.ejs", { user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function showaddress(req, res) {
  try {
    let user = req.session.userId;
    const address = await Addressdb.find({ userId: user });
    res.status(200).render("showaddress.ejs", { address });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function addaddress(req, res) {
  try {
    res.status(200).render("addAddress.ejs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function editaddress(req, res) {
  try {
    req.session.addressId = req.params.id;
    const address = await Addressdb.findOne({ _id: req.session.addressId });
    res.status(200).render("editAddress.ejs", { address });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

// export async function profile(req, res) {
//   try {
//     const user = await Userdb.findById({ _id: req.session.userId });
//     res.status(200).render("prosample.ejs", { user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// }

// export async function homepage1(req, res) {
//   try {
//     const product = await Productdb.find();
//     const userid = req.session.userId;
//     const user = await Userdb.findById(userid);
//     res.status(200).render("homePage1.ejs", { product , user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// }

// export async function logoutUser(req, res) {
//   try {
//     req.session.destroy();
//     const product = await Productdb.find();
//     res.status(200).render("homePage.ejs", { product });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// }

// //logout for home user
// export function logout  (req, res)  {
//   req.session.isauth = false;
//   axios.get(`http://localhost:${process.env.PORT}/api/logout?email=${req.query.email}`).then()
//   req.session.email = ''
//   res.redirect("/login");
// };

//   export async function UserProduct  (req, res)  {
//     const data=await Productdb.find()
//     res.render('homePage.ejs',{product:data});

// };

// export async function showprofile(req, res) {
//   try {
//     const data = await Userdb.findOne({ _id: req.params.id });
//     res.status(200).render("prosample.ejs", { user: data });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// }

export async function productpage(req, res) {
  try {
    const data = await Productdb.findOne({ _id: req.params.id });
    const userid = req.session.userId;

    console.log(userid);
    const userdata = await Userdb.findById(userid);
    res
      .status(200)
      .render("productpreview.ejs", { product: data, user: userdata });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function cart(req, res) {
  try {
    const userid = req.session.userId;

    const products = await Cartdb.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userid) },
      },
      {
        $unwind: "$products",
      },
      {
        $lookup: {
          from: Productdb.collection.name,
          localField: "products.productId",
          foreignField: "_id",
          as: "productsDetails",
        },
      },
      {
        $unwind: "$productsDetails",
      },
    ]);

    // res.status(200).render("userCart.ejs", { products });
    res.status(200).render("cart.ejs", { products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function checkout(req, res) {
  try {
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function orderslist(req, res) {
  try {
    res.render("ordersList.ejs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function orderinfo(req, res) {
  try {
    res.render("orderInfo.ejs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function productlist(req, res) {
  try {
    const products = await Productdb.find();
    const category = await Categorydb.find();
    res.render("productlist.ejs", { products, category });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
