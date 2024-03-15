import session from "express-session";
import "dotenv/config";
import Productdb from "../model/productSchema.js";
import Categorydb from "../model/categorySchema.js";
import Userdb from "../model/userSchema.js";
import Orderdb from "../model/orderSchema.js";
import Offerdb from "../model/offerSchema.js";
import Coupondb from "../model/couponSchema.js";
import {
  getAllCoupon,
  getAllDeletedCoupons,
  getAllOrders,
  getAllUsers,
  getListedAllCategories,
  getListedProducts,
  getUnlistedAllCategories,
  getUnlistedProducts,
} from "../helper/dbHelper.js";

const adminEmail = process.env.ADMIN_ID;
const adminPassword = process.env.ADMIN_PASS;

export function adminlogin(req, res) {
  try {
    res.status(200).render("adminLogin.ejs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

//Post for admin
export function isAdmin(req, res) {
  try {
    const { email: inputEmail, password: inputPassword } = req.body;
    if (inputEmail === adminEmail && inputPassword === adminPassword) {
      req.session.isAdmin = true;
      res.status(200).redirect("/adminHome");
    } else {
      res.status(200).redirect("/adminlogin");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export function logoutAdmin(req, res) {
  try {
    req.session.destroy();
    res.status(200).redirect("/adminlogin");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

// export async function adminHome(req, res) {
//   try {
//     const totalOrders = await Orderdb.aggregate([
//       {
//         $project: {
//           orderDetailsCount: { $size: "$orderDetails" },
//         },
//       },
//     ]);

//     const totalOrderCount = totalOrders.reduce(
//       (total, obj) => total + obj.orderDetailsCount,
//       0
//     );

//     const productCount = await Productdb.countDocuments({ isHidden: false });
//     const userCount = await Userdb.countDocuments({ status: true });

//     res
//       .status(200)
//       .render("adminHome.ejs", { totalOrderCount, productCount, userCount });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// }

export async function adminUser(req, res) {
  try {
    const users = await Userdb.find();
    const user = await getAllUsers(req.query.page);
    const totalUsers = users.length;
    res.status(200).render("adminUsers.ejs", {
      user,
      currentPage: Number(req.query.page),
      totalUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function adminProduct(req, res) {
  try {
    const products = await Productdb.find().populate("category");
    const product = await getListedProducts(req.query.page);
    const totalProducts = products.length;

    res.status(200).render("adminProducts.ejs", {
      product,
      totalProducts,
      currentPage: Number(req.query.page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function adminDeletedProduct(req, res) {
  try {
    const products = await Productdb.find().populate("category");
    const product = await getUnlistedProducts(req.query.page);
    const totalProducts = products.length;
    res.status(200).render("adminDeletedProducts.ejs", {
      product,
      totalProducts,
      currentPage: Number(req.query.page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function adminAddProduct(req, res) {
  try {
    const category = await Categorydb.find();
    res.status(200).render("adminAddProduct.ejs", { category });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function adminEditProduct(req, res) {
  try {
    const category = await Categorydb.find();
    const product = await Productdb.findOne({ _id: req.params.id });
    res.status(200).render("adminEditProduct.ejs", { product, category });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function adminOrder(req, res) {
  try {
    const orders = await getAllOrders(req.query.page);
    const order = await Orderdb.aggregate([
      {
        $unwind: {
          path: "$orderItems",
        },
      },
    ]);

    const totalOrders = orders.length;
    console.log(totalOrders);

    res
      .status(200)
      .render("adminOrders.ejs", {
        orders,
        currentPage: Number(req.query.page),
        totalOrders,
      });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function adminCategory(req, res) {
  try {
    const allCategories = await Categorydb.find({ isHidden: false });
    const category = await getListedAllCategories(false, req.query.page);
    const totalCategories = allCategories.length;

    res.status(200).render("adminCategories.ejs", {
      category,
      totalCategories,
      currentPage: Number(req.query.page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function adminEditCategory(req, res) {
  try {
    const category = await Categorydb.findOne({ _id: req.params.id });
    res.status(200).render("adminEditCategory.ejs", { category });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function adminUnlistedCategory(req, res) {
  try {
    const allCategories = await Categorydb.find({ isHidden: true });
    const category = await getUnlistedAllCategories(true, req.query.page);
    const totalCategories = allCategories.length;

    res.status(200).render("adminUnlistCategory.ejs", {
      category,
      totalCategories,
      currentPage: Number(req.query.page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function offer(req, res) {
  try {
    const offer = await Offerdb.find();
    res.render("adminOffer.ejs", { offer });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function editOffer(req, res) {
  try {
    const id = req.params.id;
    const offer = await Offerdb.findById(id);
    const category = await Categorydb.find();
    res.render("editOffer.ejs", { offer, category });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function addCategoryOffer(req, res) {
  try {
    const category = await Categorydb.find();
    res.render("addCategoryOffer.ejs", { category });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function addProductOffer(req, res) {
  try {
    res.render("addProductOffer.ejs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function adminCoupon(req, res) {
  try {
    const allcoupons = await Coupondb.find();
    const coupons = await getAllCoupon(null, req.query.page);
    const totalCoupons = allcoupons.length;
    console.log(coupons);

    res.render("adminCoupon.ejs", {
      coupons,
      totalCoupons,
      currentPage: Number(req.query.page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function adminAddCoupon(req, res) {
  try {
    const category = await Categorydb.find();
    res.render("adminAddCoupon.ejs", { category });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function adminEditCoupon(req, res) {
  try {
    const id = req.params.id;
    const coupon = await Coupondb.findById(id);
    const category = await Categorydb.find();
    res.render("adminEditCoupon.ejs", { coupon, category });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function adminDeletedCoupon(req, res) {
  try {
    const allcoupons = await Coupondb.find();
    const coupons = await getAllDeletedCoupons(null, req.query.page);
    const totalCoupons = allcoupons.length;
    console.log(coupons);

    res.render("adminDeletedCoupons.ejs", {
      coupons,
      totalCoupons,
      currentPage: Number(req.query.page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}