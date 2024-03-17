import Categorydb from "../model/categorySchema.js";
import Orderdb from "../model/orderSchema.js";
import Productdb from "../model/productSchema.js";
import Userdb from "../model/userSchema.js";

// export async function adminDashboard(req, res) {
//   try {
//     const orders = await Orderdb.find({ orderStatus: "Delivered" });
//     // let ledge = await Ledgerbook.find({}).sort({ _id: -1 });

//     // for (const order of orders) {
//     //   let ledger = await Ledgerbook.findOne({ Order_id: order._id });
//     //   if (!ledger) {
//     //     ledger = new Ledgerbook({
//     //       Order_id: order._id,
//     //       transactions: order.payment,
//     //       balance: order.total_amount,
//     //       debit: 0,
//     //       date: new Date(),
//     //       credit: order.total_amount,
//     //     });
//     //     await ledger.save();
//     //   }
//     // }

//     const totalOrders = await Orderdb.countDocuments({});
//     // top selling product
//     const topProduct = await Orderdb.aggregate([
//       { $unwind: "$orderDetails" },
//       {
//         $lookup: {
//           from: Productdb.collection.name,
//           localField: "orderDetails.productId",
//           foreignField: "_id",
//           as: "productsDetails",
//         },
//       },
//       { $unwind: "$productsDetails" },
//       {
//         $lookup: {
//           from: Categorydb.collection.name,
//           localField: "productDetails.category",
//           foreignField: "_id",
//           as: "categoryDetails",
//         },
//       },
//       { $unwind: "$categoryDetails" },
//       {
//         $group: {
//           _id: "$orderDetails.productId",
//           productName: { $first: "$orderDetails.pName" },
//           category: { $first: "categoryDetails.name" },
//           count: { $sum: 1 },
//         },
//       },
//       { $sort: { count: -1 } },
//     ]);

//     // top selling category
//     const topCategory = await Orderdb.aggregate([
//       { $unwind: "$orderDetails" },
//       {
//         $lookup: {
//           from: Productdb.collection.name,
//           localField: "orderDetails.productId",
//           foreignField: "_id",
//           as: "productsDetails",
//         },
//       },
//       { $unwind: "$productsDetails" },
//       {
//         $lookup: {
//           from: Categorydb.collection.name,
//           localField: "productDetails.category",
//           foreignField: "_id",
//           as: "categoryDetails",
//         },
//       },
//       { $unwind: "$categoryDetails" },
//       {
//         $group: {
//           _id: "productDetails.category",
//           category: { $first: "categoryDetails.name" },
//           count: { $sum: 1 },
//         },
//       },
//       { $sort: { count: -1 } },
//     ]);

//     // top selling category
//     //   const topBrand = await Orderdb.aggregate([
//     //     { $unwind: "$orderDetails" },
//     //     {
//     //       $group: {
//     //         _id: "$orderDetails.brand",
//     //         brand: { $first: "$orderDetails.brand" },
//     //         count: { $sum: 1 },
//     //       },
//     //     },
//     //     { $sort: { count: -1 } },
//     //   ]);

//     const yearsToInclude = 7;
//     const currentYear = new Date().getFullYear();
//     const currentMonth = new Date().getMonth() + 1;
//     const defaultMonthlyValues = Array.from({ length: 12 }, (_, i) => ({
//       month: i + 1,
//       total: 0,
//       count: 0,
//     }));

//     const defaultYearlyValues = Array.from(
//       { length: yearsToInclude },
//       (_, i) => ({
//         year: currentYear - yearsToInclude + i + 1,
//         total: 0,
//         count: 0,
//       })
//     );

//     // monthly total sales
//     const monthlySalesData = await Orderdb.aggregate([
//       {
//         $match: {
//           orderStatus: "Delivered",
//           createdAt: { $gte: new Date(currentYear, currentMonth - 1, 1) },
//         },
//       },
//       {
//         $group: {
//           _id: { $month: "$createdAt" },
//           total: {
//             $sum: "$totalsum",
//           },
//           count: { $sum: 1 },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           month: "$_id",
//           total: "$total",
//           count: "$count",
//         },
//       },
//     ]);

//     const updatedMonthlyValues = defaultMonthlyValues.map((defaultMonth) => {
//       const foundMonth = monthlySalesData.find(
//         (monthData) => monthData.month === defaultMonth.month
//       );
//       return foundMonth || defaultMonth;
//     });

//     // monthly total user
//     const monthlyTotalUsers = await Userdb.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: new Date(currentYear, currentMonth - 1, 1) },
//         },
//       },
//       {
//         $group: {
//           _id: { $month: "$createdAt" },
//           totalUsers: { $sum: 1 },
//         },
//       },
//     ]);
//     const updatedMonthlyTotalUsers = defaultMonthlyValues.map(
//       (defaultMonth) => {
//         const foundMonth = monthlyTotalUsers.find(
//           (monthData) => monthData._id === defaultMonth.month
//         );
//         return {
//           month: defaultMonth.month,
//           totalUsers: foundMonth ? foundMonth.totalUsers : 0,
//         };
//       }
//     );

//     // monthly total orders
//     const monthlyTotalOrders = await Orderdb.aggregate([
//       {
//         $unwind: "$orderDetails",
//       },
//       {
//         $match: {
//           createdAt: { $gte: new Date(currentYear, currentMonth - 1, 1) },
//         },
//       },
//       {
//         $group: {
//           _id: { $month: "$createdAt" },
//           totalOrders: { $sum: 1 },
//         },
//       },
//     ]);

//     const updatedMonthlyTotalOrders = defaultMonthlyValues.map(
//       (defaultMonth) => {
//         const foundMonth = monthlyTotalOrders.find(
//           (monthData) => monthData._id === defaultMonth.month
//         );
//         return {
//           month: defaultMonth.month,
//           totalOrders: foundMonth ? foundMonth.totalOrders : 0,
//         };
//       }
//     );

//     // total sales in year

//     const yearlySalesData = await Orderdb.aggregate([
//       {
//         $match: {
//           status: "Delivered",
//           createdAt: { $gte: new Date(currentYear - yearsToInclude, 0, 1) },
//         },
//       },
//       {
//         $group: {
//           _id: { $year: "$createdAt" },
//           totalOrders: { $sum: 1 },
//           totalSales: { $sum: "$total_amount" }, // Calculate total sales amount
//         },
//       },
//     ]);
//     // console.log("hello", yearlySalesData);

//     const updatedYearlyValues = defaultYearlyValues.map((defaultYear) => {
//       const foundYear = yearlySalesData.find(
//         (yearData) => yearData._id === defaultYear.year
//       );
//       return foundYear || defaultYear;
//     });

//     // console.log("asdfwewwqqw", updatedYearlyValues);
//     const yearlyTotalOrders = await Orderdb.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: new Date(currentYear - yearsToInclude, 0, 1) },
//         },
//       },
//       {
//         $group: {
//           _id: { $year: "$createdAt" },
//           totalOrders: { $sum: 1 },
//         },
//       },
//     ]);
//     console.log(yearlyTotalOrders, "hello");
//     // Update yearly total orders based on retrieved data
//     const updatedYearlyTotalOrders = defaultYearlyValues.map((defaultYear) => {
//       const foundYear = yearlyTotalOrders.find(
//         (yearData) => yearData._id === defaultYear.year
//       );
//       return {
//         year: defaultYear.year,
//         totalOrders: foundYear ? foundYear.totalOrders : 0,
//       };
//     });
//     console.log(updatedYearlyTotalOrders, "hello2");
//     const yearlyTotalUsers = await Userdb.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: new Date(currentYear - yearsToInclude, 0, 1) },
//         },
//       },
//       {
//         $group: {
//           _id: { $year: "$createdAt" },
//           totalUsers: { $sum: 1 },
//         },
//       },
//     ]);

//     // Update yearly total users based on retrieved data
//     const updatedYearlyTotalUsers = defaultYearlyValues.map((defaultYear) => {
//       const foundYear = yearlyTotalUsers.find(
//         (yearData) => yearData._id === defaultYear.year
//       );
//       return {
//         year: defaultYear.year,
//         totalUsers: foundYear ? foundYear.totalUsers : 0,
//       };
//     });

//     const EveryMonthlySalesData = await Orderdb.aggregate([
//       {
//         $match: {
//           status: "Delivered",
//           createdAt: { $gte: new Date(currentYear, 0, 1) },
//         },
//       },
//       {
//         $group: {
//           _id: {
//             year: { $year: "$createdAt" },
//             month: { $month: "$createdAt" },
//           },
//           total: { $sum: "$total_amount" },
//           count: { $sum: 1 },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           month: "$_id.month",
//           total: "$total",
//           count: "$count",
//         },
//       },
//     ]);

//     const EveryMonthlySales = defaultMonthlyValues.map((defaultMonth) => {
//       const foundMonth = EveryMonthlySalesData.find(
//         (monthData) => monthData.month === defaultMonth.month
//       );
//       return foundMonth || defaultMonth;
//     });

//     const EveryMonthlyUserData = await Orderdb.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: new Date(currentYear, 0, 1) },
//         },
//       },
//       {
//         $group: {
//           _id: { $month: "$createdAt" },
//           totalUsers: { $sum: 1 },
//         },
//       },
//     ]);
//     const EveryMonthlyTotalUsers = defaultMonthlyValues.map((defaultMonth) => {
//       const foundMonth = EveryMonthlyUserData.find(
//         (monthData) => monthData._id === defaultMonth.month
//       );
//       return {
//         month: defaultMonth.month,
//         totalUsers: foundMonth ? foundMonth.totalUsers : 0,
//       };
//     });
//     console.log(EveryMonthlyTotalUsers, "hekko");

//     const EveryMonthlyTotalOrders = await Orderdb.aggregate([
//       {
//         $unwind: "$items",
//       },
//       {
//         $match: {
//           createdAt: { $gte: new Date(currentYear, 0, 1) },
//         },
//       },
//       {
//         $group: {
//           _id: { $month: "$createdAt" },
//           totalOrders: { $sum: 1 },
//         },
//       },
//     ]);

//     const EveryMonthlyOrders = defaultMonthlyValues.map((defaultMonth) => {
//       const foundMonth = EveryMonthlyTotalOrders.find(
//         (monthData) => monthData._id === defaultMonth.month
//       );
//       return {
//         month: defaultMonth.month,
//         totalOrders: foundMonth ? foundMonth.totalOrders : 0,
//       };
//     });

//     console.log(EveryMonthlyOrders, "hello");
//     // console.log(updatedYearlyTotalOrders);

//     const totalOrdersCount = await Orderdb.aggregate([
//       {
//         $project: {
//           orderDetailsCount: { $size: "$orderDetails" },
//         },
//       },
//     ]);

//     const totalOrderCount = totalOrdersCount.reduce(
//       (total, obj) => total + obj.orderDetailsCount,
//       0
//     );

//     const productCount = await Productdb.countDocuments({ isHidden: false });
//     const userCount = await Userdb.countDocuments({ status: true });
//     res.status(200).render("adminHome.ejs", {
//       totalOrderCount,
//       productCount,
//       userCount,
//       updatedMonthlyValues,
//       updatedMonthlyTotalUsers,
//       updatedMonthlyTotalOrders,
//       updatedYearlyValues,
//       updatedYearlyTotalOrders,
//       updatedYearlyTotalUsers,
//       topProduct,
//       topCategory,
//       orders,
//       totalOrders,
//       EveryMonthlySales,
//       EveryMonthlyTotalUsers,
//       EveryMonthlyOrders,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// }

export async function adminDashboard(req, res) {
  try {
    const countUsers = await Userdb.countDocuments();
    const ordercount = await Orderdb.countDocuments();
    const orderTotalAmountObject = await Orderdb.aggregate([
      {
        $unwind: "$orderDetails",
      },
      {
        $group: {
          _id: "$_id",
          totalPrice: { $sum: "$orderDetails.price" },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalPrice" },
        },
      },
    ]);

    const topProducts = await Orderdb.aggregate([
      { $unwind: { path: "$orderDetails" } },
      {
        $group: {
          _id: "$orderDetails.productId",
          productName: { $first: "$orderDetails.pName" },
          totalQuantitySold: { $sum: "$orderDetails.quantity" },
        },
      },
      { $project: { _id: 0, productName: 1, totalQuantitySold: 1 } },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 3 },
    ]);

    const topCategory = await Orderdb.aggregate([
      { $unwind: "$orderDetails" },
      {
        $lookup: {
          from: Productdb.collection.name,
          localField: "orderDetails.productId",
          foreignField: "_id",
          as: "productsDetails",
        },
      },
      { $unwind: "$productsDetails" },
      {
        $lookup: {
          from: Categorydb.collection.name,
          localField: "productsDetails.category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      {
        $group: {
          _id: "$categoryDetails.name",
          totalQuantitySold: { $sum: "$orderDetails.quantity" },
        },
      },
      { $project: { _id: 0, _id: 1, totalQuantitySold: 1 } },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 3 },
    ]);

    const orderTotalAmount = orderTotalAmountObject
      ? orderTotalAmountObject[0].totalAmount
      : undefined;

    // console.log(countUsers, "users count");
    // console.log(ordercount, "order count");
    // console.log(orderTotalAmount, "ordertotalamount");
    // console.log(topProducts, "top product");
    // console.log(topCategory, "top category");
    res.render("adminHome.ejs", {
      countUser: countUsers,
      ordercount: ordercount,
      orderTotalAmount: orderTotalAmount,
      topProducts: topProducts,
      topCategory: topCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function getDetailsChart(req, res) {
  try {
    let labelObj = {};
    let salesCount;
    let findQuerry;
    let currentYear;
    let currentMonth;
    let index;

    switch (req.body.filter.toLowerCase()) {
      case "weekly":
        currentYear = new Date().getFullYear();
        currentMonth = new Date().getMonth() + 1;

        labelObj = {
          Sun: 0,
          Mon: 1,
          Tue: 2,
          Wed: 3,
          Thu: 4,
          Fri: 5,
          Sat: 6,
        };

        salesCount = new Array(7).fill(0);

        findQuerry = {
          "orderDetails.orderDate": {
            $gte: new Date(currentYear, currentMonth - 1, 1),
            $lte: new Date(currentYear, currentMonth, 0, 23, 59, 59),
          },
        };
        index = 0;
        break;
      case "monthly":
        currentYear = new Date().getFullYear();
        labelObj = {
          Jan: 0,
          Feb: 1,
          Mar: 2,
          Apr: 3,
          May: 4,
          Jun: 5,
          Jul: 6,
          Aug: 7,
          Sep: 8,
          Oct: 9,
          Nov: 10,
          Dec: 11,
        };

        salesCount = new Array(12).fill(0);

        findQuerry = {
          "orderDetails.orderDate": {
            $gte: new Date(currentYear, 0, 1),
            $lte: new Date(currentYear, 11, 31, 23, 59, 59),
          },
        };
        index = 1;
        break;
      case "daily":
        currentYear = new Date().getFullYear();
        currentMonth = new Date().getMonth() + 1;
        let end = new Date(currentYear, currentMonth, 0, 23, 59, 59);
        end = String(end).split(" ")[2];
        end = Number(end);

        for (let i = 0; i < end; i++) {
          labelObj[`${i + 1}`] = i;
        }

        salesCount = new Array(end).fill(0);

        findQuerry = {
          "orderDetails.orderDate": {
            $gt: new Date(currentYear, currentMonth - 1, 1),
            $lte: new Date(currentYear, currentMonth, 0, 23, 59, 59),
          },
        };

        index = 2;
        break;
      case "yearly":
        findQuerry = {};

        const ord = await Orderdb.find().sort({ "orderDetails.orderDate": 1 });
        const stDate = ord[0].orderDetails[0].orderDate.getFullYear();
        const endDate =
          ord[ord.length - 1].orderDetails[0].orderDate.getFullYear();

        for (let i = 0; i <= Number(endDate) - Number(stDate); i++) {
          labelObj[`${stDate + i}`] = i;
        }

        salesCount = new Array(Object.keys(labelObj).length).fill(0);

        index = 3;
        break;
      default:
        return res.json({
          label: [],
          salesCount: [],
        });
    }

    const orders = await Orderdb.aggregate([
      {
        $unwind: {
          path: "$orderDetails",
        },
      },
      {
        $match: findQuerry,
      },
    ]);

    const a = orders.forEach((order) => {
        if (index === 2) {
            salesCount[
                labelObj[Number(String(order.orderDetails.orderDate).split(" ")[index])]
            ] += 1;
        } else {
            salesCount[labelObj[String(order.orderDetails.orderDate).split(" ")[index]]] += 1;
        }
    });

    res.json({
      label: Object.keys(labelObj),
      salesCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
