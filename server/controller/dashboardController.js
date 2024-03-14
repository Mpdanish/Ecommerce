import Categorydb from "../model/categorySchema.js";
import Orderdb from "../model/orderSchema.js";
import Productdb from "../model/productSchema.js";
import Userdb from "../model/userSchema.js";

export async function loadDashboard(req, res) {
  try {
    const orders = await Orderdb.find({ orderStatus: "Delivered" });
    // let ledge = await Ledgerbook.find({}).sort({ _id: -1 });

    // for (const order of orders) {
    //   let ledger = await Ledgerbook.findOne({ Order_id: order._id });
    //   if (!ledger) {
    //     ledger = new Ledgerbook({
    //       Order_id: order._id,
    //       transactions: order.payment,
    //       balance: order.total_amount,
    //       debit: 0,
    //       date: new Date(),
    //       credit: order.total_amount,
    //     });
    //     await ledger.save();
    //   }
    // }

    const totalOrders = await Orderdb.countDocuments({});
    // top selling product
    const topProduct = await Orderdb.aggregate([
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
          localField: "productDetails.category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      {
        $group: {
          _id: "$orderDetails.productId",
          productName: { $first: "$orderDetails.pName" },
          category: { $first: "categoryDetails.name" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // top selling category
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
          localField: "productDetails.category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      {
        $group: {
          _id: "productDetails.category",
          category: { $first: "categoryDetails.name" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // top selling category
    //   const topBrand = await Orderdb.aggregate([
    //     { $unwind: "$orderDetails" },
    //     {
    //       $group: {
    //         _id: "$orderDetails.brand",
    //         brand: { $first: "$orderDetails.brand" },
    //         count: { $sum: 1 },
    //       },
    //     },
    //     { $sort: { count: -1 } },
    //   ]);

    const yearsToInclude = 7;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const defaultMonthlyValues = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      total: 0,
      count: 0,
    }));

    const defaultYearlyValues = Array.from(
      { length: yearsToInclude },
      (_, i) => ({
        year: currentYear - yearsToInclude + i + 1,
        total: 0,
        count: 0,
      })
    );

    // monthly total sales
    const monthlySalesData = await Orderdb.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
          createdAt: { $gte: new Date(currentYear, currentMonth - 1, 1) },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: {
            $sum: "$totalsum",
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          total: "$total",
          count: "$count",
        },
      },
    ]);

    const updatedMonthlyValues = defaultMonthlyValues.map((defaultMonth) => {
      const foundMonth = monthlySalesData.find(
        (monthData) => monthData.month === defaultMonth.month
      );
      return foundMonth || defaultMonth;
    });

    // monthly total user
    const monthlyTotalUsers = await Userdb.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(currentYear, currentMonth - 1, 1) },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalUsers: { $sum: 1 },
        },
      },
    ]);
    const updatedMonthlyTotalUsers = defaultMonthlyValues.map(
      (defaultMonth) => {
        const foundMonth = monthlyTotalUsers.find(
          (monthData) => monthData._id === defaultMonth.month
        );
        return {
          month: defaultMonth.month,
          totalUsers: foundMonth ? foundMonth.totalUsers : 0,
        };
      }
    );

    // monthly total orders
    const monthlyTotalOrders = await Orderdb.aggregate([
      {
        $unwind: "$orderDetails",
      },
      {
        $match: {
          createdAt: { $gte: new Date(currentYear, currentMonth - 1, 1) },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const updatedMonthlyTotalOrders = defaultMonthlyValues.map(
      (defaultMonth) => {
        const foundMonth = monthlyTotalOrders.find(
          (monthData) => monthData._id === defaultMonth.month
        );
        return {
          month: defaultMonth.month,
          totalOrders: foundMonth ? foundMonth.totalOrders : 0,
        };
      }
    );

    // total sales in year

    const yearlySalesData = await Orderdb.aggregate([
      {
        $match: {
          status: "Delivered",
          createdAt: { $gte: new Date(currentYear - yearsToInclude, 0, 1) },
        },
      },
      {
        $group: {
          _id: { $year: "$createdAt" },
          totalOrders: { $sum: 1 },
          totalSales: { $sum: "$total_amount" }, // Calculate total sales amount
        },
      },
    ]);
    // console.log("hello", yearlySalesData);

    const updatedYearlyValues = defaultYearlyValues.map((defaultYear) => {
      const foundYear = yearlySalesData.find(
        (yearData) => yearData._id === defaultYear.year
      );
      return foundYear || defaultYear;
    });

    // console.log("asdfwewwqqw", updatedYearlyValues);
    const yearlyTotalOrders = await Orderdb.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(currentYear - yearsToInclude, 0, 1) },
        },
      },
      {
        $group: {
          _id: { $year: "$createdAt" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);
    console.log(yearlyTotalOrders, "hello");
    // Update yearly total orders based on retrieved data
    const updatedYearlyTotalOrders = defaultYearlyValues.map((defaultYear) => {
      const foundYear = yearlyTotalOrders.find(
        (yearData) => yearData._id === defaultYear.year
      );
      return {
        year: defaultYear.year,
        totalOrders: foundYear ? foundYear.totalOrders : 0,
      };
    });
    console.log(updatedYearlyTotalOrders, "hello2");
    const yearlyTotalUsers = await Userdb.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(currentYear - yearsToInclude, 0, 1) },
        },
      },
      {
        $group: {
          _id: { $year: "$createdAt" },
          totalUsers: { $sum: 1 },
        },
      },
    ]);

    // Update yearly total users based on retrieved data
    const updatedYearlyTotalUsers = defaultYearlyValues.map((defaultYear) => {
      const foundYear = yearlyTotalUsers.find(
        (yearData) => yearData._id === defaultYear.year
      );
      return {
        year: defaultYear.year,
        totalUsers: foundYear ? foundYear.totalUsers : 0,
      };
    });

    const EveryMonthlySalesData = await Orderdb.aggregate([
      {
        $match: {
          status: "Delivered",
          createdAt: { $gte: new Date(currentYear, 0, 1) },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$total_amount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          total: "$total",
          count: "$count",
        },
      },
    ]);

    const EveryMonthlySales = defaultMonthlyValues.map((defaultMonth) => {
      const foundMonth = EveryMonthlySalesData.find(
        (monthData) => monthData.month === defaultMonth.month
      );
      return foundMonth || defaultMonth;
    });

    const EveryMonthlyUserData = await Orderdb.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(currentYear, 0, 1) },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalUsers: { $sum: 1 },
        },
      },
    ]);
    const EveryMonthlyTotalUsers = defaultMonthlyValues.map((defaultMonth) => {
      const foundMonth = EveryMonthlyUserData.find(
        (monthData) => monthData._id === defaultMonth.month
      );
      return {
        month: defaultMonth.month,
        totalUsers: foundMonth ? foundMonth.totalUsers : 0,
      };
    });
    console.log(EveryMonthlyTotalUsers, "hekko");

    const EveryMonthlyTotalOrders = await Orderdb.aggregate([
      {
        $unwind: "$items",
      },
      {
        $match: {
          createdAt: { $gte: new Date(currentYear, 0, 1) },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const EveryMonthlyOrders = defaultMonthlyValues.map((defaultMonth) => {
      const foundMonth = EveryMonthlyTotalOrders.find(
        (monthData) => monthData._id === defaultMonth.month
      );
      return {
        month: defaultMonth.month,
        totalOrders: foundMonth ? foundMonth.totalOrders : 0,
      };
    });

    console.log(EveryMonthlyOrders, "hello");
    // console.log(updatedYearlyTotalOrders);
    res.render("Dashboard", {
      updatedMonthlyValues,
      updatedMonthlyTotalUsers,
      updatedMonthlyTotalOrders,
      updatedYearlyValues,
      updatedYearlyTotalOrders,
      updatedYearlyTotalUsers,
      topProduct,
      topCategory,
      topBrand,
      orders,
      totalOrders,
      ledge,
      EveryMonthlySales,
      EveryMonthlyTotalUsers,
      EveryMonthlyOrders,
    });
  } catch (error) {
    console.log(error.message);
  }
}
