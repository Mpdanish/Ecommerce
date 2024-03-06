import PDFDocument from "pdfkit-table";
import Excel from "excel4node";
import Orderdb from "../model/orderSchema.js";

// export async function customDateSales(req, res) {
//   try {
//     const { fromDate, toDate, pdfChecked, excelChecked, reportInterval } =
//       req.body;
//     console.log(req.body);

//     if (reportInterval == "daily") {
//       const today = new Date();
//       const startOfDay = new Date(
//         today.getFullYear(),
//         today.getMonth(),
//         today.getDate()
//       );
//       const endOfDay = new Date(
//         today.getFullYear(),
//         today.getMonth(),
//         today.getDate() + 1
//       );

//       const salesData = await Orderdb.aggregate([
//         {
//           $unwind: "$orderDetails", // Deconstruct the orderDetails array
//         },
//         {
//           $project: {
//             // Project the fields you want to include in the result
//             orderId: "$_id", // Include the orderId if needed
//             userId: 1, // Include other fields if needed
//             productName: "$orderDetails.pName",
//             pricePerUnit: "$orderDetails.price",
//             quantity: "$orderDetails.quantity",
//             paymentMethod: "$orderDetails.paymentMethod",
//             orderStatus: "$orderDetails.orderStatus",
//             orderDate: "$orderDetails.orderDate",
//             totalAmount: {
//               $multiply: ["$orderDetails.price", "$orderDetails.quantity"],
//             }, // Calculate the total amount
//           },
//         },
//         {
//           $match: {
//             orderDate: {
//               $gte: new Date(startOfDay),
//               $lte: new Date(endOfDay),
//             },
//           },
//         },
//       ]);

//       if (excelChecked == "true") {
//         // Create a new Excel workbook
//         const wb = new Excel.Workbook();
//         const ws = wb.addWorksheet("Sales Report");

//         // Define table headers
//         const headers = [
//           "Order ID",
//           "Order Date",
//           "Product Name",
//           "Order Status",
//           "Quantity",
//           "Unit Price",
//           "Total Amount",
//         ];

//         // Add headers to the Excel worksheet
//         headers.forEach((header, index) => {
//           ws.cell(1, index + 1).string(header);
//         });

//         // Populate data rows
//         salesData.forEach((order, rowIndex) => {
//           ws.cell(rowIndex + 2, 1).string(
//             order.orderId.toString().split("").slice(18, 24).join("")
//           );
//           ws.cell(rowIndex + 2, 2).date(new Date(order.orderDate));
//           ws.cell(rowIndex + 2, 3).string(order.productName);
//           ws.cell(rowIndex + 2, 4).string(order.orderStatus);
//           ws.cell(rowIndex + 2, 5).number(order.quantity);
//           ws.cell(rowIndex + 2, 6).number(order.pricePerUnit);
//           ws.cell(rowIndex + 2, 7).number(order.totalAmount);
//         });

//         // Calculate total sales amount
//         const totalSalesAmount = salesData.reduce(
//           (total, order) => total + order.totalAmount,
//           0
//         );

//         // Add total sales amount row
//         ws.cell(salesData.length + 2, 1).string("Total Sales Amount");
//         ws.cell(salesData.length + 2, 7).number(totalSalesAmount);

//         // Add total order count row
//         ws.cell(salesData.length + 3, 1).string("Total Order Count");
//         ws.cell(salesData.length + 3, 7).number(salesData.length);

//         // Set up response headers for downloading
//         res.setHeader(
//           "Content-Type",
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         );
//         res.setHeader(
//           "Content-Disposition",
//           'attachment; filename="custom_date_sales_report.xlsx"'
//         );

//         // Write the workbook to response
//         wb.writeToBuffer().then((buffer) => {
//           res.send(buffer);
//         });
//       }

//       if (pdfChecked == "true") {
//         const salesData = await Orderdb.aggregate([
//           {
//             $unwind: "$orderDetails", // Deconstruct the orderDetails array
//           },
//           {
//             $project: {
//               // Project the fields you want to include in the result
//               orderId: "$_id", // Include the orderId if needed
//               userId: 1, // Include other fields if needed
//               productName: "$orderDetails.pName",
//               pricePerUnit: "$orderDetails.price",
//               quantity: "$orderDetails.quantity",
//               paymentMethod: "$orderDetails.paymentMethod",
//               orderStatus: "$orderDetails.orderStatus",
//               orderDate: "$orderDetails.orderDate",
//               totalAmount: {
//                 $multiply: ["$orderDetails.price", "$orderDetails.quantity"],
//               }, // Calculate the total amount
//             },
//           },
//           {
//             $match: {
//               orderDate: {
//                 $gte: new Date(fromDate),
//                 $lte: new Date(toDate),
//               },
//             },
//           },
//         ]);

//         const totalCount = salesData.length;

//         const tableHeaders = [
//           "Order ID",
//           "Order Date",
//           "Product Name",
//           "Order Status",
//           "Quantity",
//           "Unit Price",
//           "Total Amount",
//         ];
//         const tableData = [];

//         salesData.forEach((order) => {
//           tableData.push([
//             order.orderId.toString().split("").slice(18, 24).join(""),
//             new Date(order.orderDate)
//               .toISOString()
//               .split("T")[0]
//               .split("-")
//               .reverse()
//               .join("-"),
//             order.productName,
//             order.orderStatus,
//             order.quantity,
//             order.pricePerUnit,
//             order.totalAmount,
//           ]);
//         });

//         const totalPrice = salesData.reduce((total, value) => {
//           return (total += value.totalAmount);
//         }, 0);

//         // Add total price as the last row
//         tableData.push([
//           "Total Sales Amount",
//           "",
//           "",
//           "",
//           "",
//           "",
//           totalPrice.toString(),
//         ]);

//         tableData.push([
//           "Total Sales Count",
//           "",
//           "",
//           "",
//           "",
//           "",
//           totalCount.toString(),
//         ]);

//         const doc = new PDFDocument();

//         res.setHeader("Content-Type", "application/pdf");
//         res.setHeader(
//           "Content-Disposition",
//           'attachment; filename="custom_date_sales_report.pdf"'
//         );

//         doc.pipe(res);

//         doc.fontSize(14).text("Sales Report", { align: "center" }).moveDown();

//         const tableOptions = {
//           title: "Sales Report",
//           headers: tableHeaders,
//           rows: tableData,
//         };

//         await doc.table(tableOptions);

//         doc.end();
//       }
//     } else if (reportInterval == "weekly") {
//       const startDate = new Date();
//       const endDate = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);

//       const salesData = await Orderdb.aggregate([
//         {
//           $unwind: "$orderDetails", // Deconstruct the orderDetails array
//         },
//         {
//           $project: {
//             // Project the fields you want to include in the result
//             orderId: "$_id", // Include the orderId if needed
//             userId: 1, // Include other fields if needed
//             productName: "$orderDetails.pName",
//             pricePerUnit: "$orderDetails.price",
//             quantity: "$orderDetails.quantity",
//             paymentMethod: "$orderDetails.paymentMethod",
//             orderStatus: "$orderDetails.orderStatus",
//             orderDate: "$orderDetails.orderDate",
//             totalAmount: {
//               $multiply: ["$orderDetails.price", "$orderDetails.quantity"],
//             }, // Calculate the total amount
//           },
//         },
//         {
//           $match: {
//             orderDate: {
//               $gte: new Date(startDate),
//               $lte: new Date(endDate),
//             },
//           },
//         },
//       ]);

//       if (excelChecked == "true") {
//         // Create a new Excel workbook
//         const wb = new Excel.Workbook();
//         const ws = wb.addWorksheet("Sales Report");

//         // Define table headers
//         const headers = [
//           "Order ID",
//           "Order Date",
//           "Product Name",
//           "Order Status",
//           "Quantity",
//           "Unit Price",
//           "Total Amount",
//         ];

//         // Add headers to the Excel worksheet
//         headers.forEach((header, index) => {
//           ws.cell(1, index + 1).string(header);
//         });

//         // Populate data rows
//         salesData.forEach((order, rowIndex) => {
//           ws.cell(rowIndex + 2, 1).string(
//             order.orderId.toString().split("").slice(18, 24).join("")
//           );
//           ws.cell(rowIndex + 2, 2).date(new Date(order.orderDate));
//           ws.cell(rowIndex + 2, 3).string(order.productName);
//           ws.cell(rowIndex + 2, 4).string(order.orderStatus);
//           ws.cell(rowIndex + 2, 5).number(order.quantity);
//           ws.cell(rowIndex + 2, 6).number(order.pricePerUnit);
//           ws.cell(rowIndex + 2, 7).number(order.totalAmount);
//         });

//         // Calculate total sales amount
//         const totalSalesAmount = salesData.reduce(
//           (total, order) => total + order.totalAmount,
//           0
//         );

//         // Add total sales amount row
//         ws.cell(salesData.length + 2, 1).string("Total Sales Amount");
//         ws.cell(salesData.length + 2, 7).number(totalSalesAmount);

//         // Add total order count row
//         ws.cell(salesData.length + 3, 1).string("Total Order Count");
//         ws.cell(salesData.length + 3, 7).number(salesData.length);

//         // Set up response headers for downloading
//         res.setHeader(
//           "Content-Type",
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         );
//         res.setHeader(
//           "Content-Disposition",
//           'attachment; filename="custom_date_sales_report.xlsx"'
//         );

//         // Write the workbook to response
//         wb.writeToBuffer().then((buffer) => {
//           res.send(buffer);
//         });
//       }

//       if (pdfChecked == "true") {
//         const salesData = await Orderdb.aggregate([
//           {
//             $unwind: "$orderDetails", // Deconstruct the orderDetails array
//           },
//           {
//             $project: {
//               // Project the fields you want to include in the result
//               orderId: "$_id", // Include the orderId if needed
//               userId: 1, // Include other fields if needed
//               productName: "$orderDetails.pName",
//               pricePerUnit: "$orderDetails.price",
//               quantity: "$orderDetails.quantity",
//               paymentMethod: "$orderDetails.paymentMethod",
//               orderStatus: "$orderDetails.orderStatus",
//               orderDate: "$orderDetails.orderDate",
//               totalAmount: {
//                 $multiply: ["$orderDetails.price", "$orderDetails.quantity"],
//               }, // Calculate the total amount
//             },
//           },
//           {
//             $match: {
//               orderDate: {
//                 $gte: new Date(fromDate),
//                 $lte: new Date(toDate),
//               },
//             },
//           },
//         ]);

//         const totalCount = salesData.length;

//         const tableHeaders = [
//           "Order ID",
//           "Order Date",
//           "Product Name",
//           "Order Status",
//           "Quantity",
//           "Unit Price",
//           "Total Amount",
//         ];
//         const tableData = [];

//         salesData.forEach((order) => {
//           tableData.push([
//             order.orderId.toString().split("").slice(18, 24).join(""),
//             new Date(order.orderDate)
//               .toISOString()
//               .split("T")[0]
//               .split("-")
//               .reverse()
//               .join("-"),
//             order.productName,
//             order.orderStatus,
//             order.quantity,
//             order.pricePerUnit,
//             order.totalAmount,
//           ]);
//         });

//         const totalPrice = salesData.reduce((total, value) => {
//           return (total += value.totalAmount);
//         }, 0);

//         // Add total price as the last row
//         tableData.push([
//           "Total Sales Amount",
//           "",
//           "",
//           "",
//           "",
//           "",
//           totalPrice.toString(),
//         ]);

//         tableData.push([
//           "Total Sales Count",
//           "",
//           "",
//           "",
//           "",
//           "",
//           totalCount.toString(),
//         ]);

//         const doc = new PDFDocument();

//         res.setHeader("Content-Type", "application/pdf");
//         res.setHeader(
//           "Content-Disposition",
//           'attachment; filename="custom_date_sales_report.pdf"'
//         );

//         doc.pipe(res);

//         doc.fontSize(14).text("Sales Report", { align: "center" }).moveDown();

//         const tableOptions = {
//           title: "Sales Report",
//           headers: tableHeaders,
//           rows: tableData,
//         };

//         await doc.table(tableOptions);

//         doc.end();
//       }
//     } else if (reportInterval == "yearly") {
//       const startOfYear = new Date(new Date().getFullYear(), 0, 1);
//       const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);

//       const salesData = await Orderdb.aggregate([
//         {
//           $unwind: "$orderDetails", // Deconstruct the orderDetails array
//         },
//         {
//           $project: {
//             // Project the fields you want to include in the result
//             orderId: "$_id", // Include the orderId if needed
//             userId: 1, // Include other fields if needed
//             productName: "$orderDetails.pName",
//             pricePerUnit: "$orderDetails.price",
//             quantity: "$orderDetails.quantity",
//             paymentMethod: "$orderDetails.paymentMethod",
//             orderStatus: "$orderDetails.orderStatus",
//             orderDate: "$orderDetails.orderDate",
//             totalAmount: {
//               $multiply: ["$orderDetails.price", "$orderDetails.quantity"],
//             }, // Calculate the total amount
//           },
//         },
//         {
//           $match: {
//             orderDate: {
//               $gte: new Date(startOfYear),
//               $lte: new Date(endOfYear),
//             },
//           },
//         },
//       ]);
//       if (excelChecked == "true") {
//         // Create a new Excel workbook
//         const wb = new Excel.Workbook();
//         const ws = wb.addWorksheet("Sales Report");

//         // Define table headers
//         const headers = [
//           "Order ID",
//           "Order Date",
//           "Product Name",
//           "Order Status",
//           "Quantity",
//           "Unit Price",
//           "Total Amount",
//         ];

//         // Add headers to the Excel worksheet
//         headers.forEach((header, index) => {
//           ws.cell(1, index + 1).string(header);
//         });

//         // Populate data rows
//         salesData.forEach((order, rowIndex) => {
//           ws.cell(rowIndex + 2, 1).string(
//             order.orderId.toString().split("").slice(18, 24).join("")
//           );
//           ws.cell(rowIndex + 2, 2).date(new Date(order.orderDate));
//           ws.cell(rowIndex + 2, 3).string(order.productName);
//           ws.cell(rowIndex + 2, 4).string(order.orderStatus);
//           ws.cell(rowIndex + 2, 5).number(order.quantity);
//           ws.cell(rowIndex + 2, 6).number(order.pricePerUnit);
//           ws.cell(rowIndex + 2, 7).number(order.totalAmount);
//         });

//         // Calculate total sales amount
//         const totalSalesAmount = salesData.reduce(
//           (total, order) => total + order.totalAmount,
//           0
//         );

//         // Add total sales amount row
//         ws.cell(salesData.length + 2, 1).string("Total Sales Amount");
//         ws.cell(salesData.length + 2, 7).number(totalSalesAmount);

//         // Add total order count row
//         ws.cell(salesData.length + 3, 1).string("Total Order Count");
//         ws.cell(salesData.length + 3, 7).number(salesData.length);

//         // Set up response headers for downloading
//         res.setHeader(
//           "Content-Type",
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         );
//         res.setHeader(
//           "Content-Disposition",
//           'attachment; filename="custom_date_sales_report.xlsx"'
//         );

//         // Write the workbook to response
//         wb.writeToBuffer().then((buffer) => {
//           res.send(buffer);
//         });
//       }

//       if (pdfChecked == "true") {
//         const salesData = await Orderdb.aggregate([
//           {
//             $unwind: "$orderDetails", // Deconstruct the orderDetails array
//           },
//           {
//             $project: {
//               // Project the fields you want to include in the result
//               orderId: "$_id", // Include the orderId if needed
//               userId: 1, // Include other fields if needed
//               productName: "$orderDetails.pName",
//               pricePerUnit: "$orderDetails.price",
//               quantity: "$orderDetails.quantity",
//               paymentMethod: "$orderDetails.paymentMethod",
//               orderStatus: "$orderDetails.orderStatus",
//               orderDate: "$orderDetails.orderDate",
//               totalAmount: {
//                 $multiply: ["$orderDetails.price", "$orderDetails.quantity"],
//               }, // Calculate the total amount
//             },
//           },
//           {
//             $match: {
//               orderDate: {
//                 $gte: new Date(fromDate),
//                 $lte: new Date(toDate),
//               },
//             },
//           },
//         ]);

//         const totalCount = salesData.length;

//         const tableHeaders = [
//           "Order ID",
//           "Order Date",
//           "Product Name",
//           "Order Status",
//           "Quantity",
//           "Unit Price",
//           "Total Amount",
//         ];
//         const tableData = [];

//         salesData.forEach((order) => {
//           tableData.push([
//             order.orderId.toString().split("").slice(18, 24).join(""),
//             new Date(order.orderDate)
//               .toISOString()
//               .split("T")[0]
//               .split("-")
//               .reverse()
//               .join("-"),
//             order.productName,
//             order.orderStatus,
//             order.quantity,
//             order.pricePerUnit,
//             order.totalAmount,
//           ]);
//         });

//         const totalPrice = salesData.reduce((total, value) => {
//           return (total += value.totalAmount);
//         }, 0);

//         // Add total price as the last row
//         tableData.push([
//           "Total Sales Amount",
//           "",
//           "",
//           "",
//           "",
//           "",
//           totalPrice.toString(),
//         ]);

//         tableData.push([
//           "Total Sales Count",
//           "",
//           "",
//           "",
//           "",
//           "",
//           totalCount.toString(),
//         ]);

//         const doc = new PDFDocument();

//         res.setHeader("Content-Type", "application/pdf");
//         res.setHeader(
//           "Content-Disposition",
//           'attachment; filename="custom_date_sales_report.pdf"'
//         );

//         doc.pipe(res);

//         doc.fontSize(14).text("Sales Report", { align: "center" }).moveDown();

//         const tableOptions = {
//           title: "Sales Report",
//           headers: tableHeaders,
//           rows: tableData,
//         };

//         await doc.table(tableOptions);

//         doc.end();
//       }
//     } else if (reportInterval == "") {
//       const salesData = await Orderdb.aggregate([
//         {
//           $unwind: "$orderDetails", // Deconstruct the orderDetails array
//         },
//         {
//           $project: {
//             // Project the fields you want to include in the result
//             orderId: "$_id", // Include the orderId if needed
//             userId: 1, // Include other fields if needed
//             productName: "$orderDetails.pName",
//             pricePerUnit: "$orderDetails.price",
//             quantity: "$orderDetails.quantity",
//             paymentMethod: "$orderDetails.paymentMethod",
//             orderStatus: "$orderDetails.orderStatus",
//             orderDate: "$orderDetails.orderDate",
//             totalAmount: {
//               $multiply: ["$orderDetails.price", "$orderDetails.quantity"],
//             }, // Calculate the total amount
//           },
//         },
//         {
//           $match: {
//             orderDate: {
//               $gte: new Date(fromDate),
//               $lte: new Date(toDate),
//             },
//           },
//         },
//       ]);
//       if (excelChecked == "true") {
//         // Create a new Excel workbook
//         const wb = new Excel.Workbook();
//         const ws = wb.addWorksheet("Sales Report");

//         // Define table headers
//         const headers = [
//           "Order ID",
//           "Order Date",
//           "Product Name",
//           "Order Status",
//           "Quantity",
//           "Unit Price",
//           "Total Amount",
//         ];

//         // Add headers to the Excel worksheet
//         headers.forEach((header, index) => {
//           ws.cell(1, index + 1).string(header);
//         });

//         // Populate data rows
//         salesData.forEach((order, rowIndex) => {
//           ws.cell(rowIndex + 2, 1).string(
//             order.orderId.toString().split("").slice(18, 24).join("")
//           );
//           ws.cell(rowIndex + 2, 2).date(new Date(order.orderDate));
//           ws.cell(rowIndex + 2, 3).string(order.productName);
//           ws.cell(rowIndex + 2, 4).string(order.orderStatus);
//           ws.cell(rowIndex + 2, 5).number(order.quantity);
//           ws.cell(rowIndex + 2, 6).number(order.pricePerUnit);
//           ws.cell(rowIndex + 2, 7).number(order.totalAmount);
//         });

//         // Calculate total sales amount
//         const totalSalesAmount = salesData.reduce(
//           (total, order) => total + order.totalAmount,
//           0
//         );

//         // Add total sales amount row
//         ws.cell(salesData.length + 2, 1).string("Total Sales Amount");
//         ws.cell(salesData.length + 2, 7).number(totalSalesAmount);

//         // Add total order count row
//         ws.cell(salesData.length + 3, 1).string("Total Order Count");
//         ws.cell(salesData.length + 3, 7).number(salesData.length);

//         // Set up response headers for downloading
//         res.setHeader(
//           "Content-Type",
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         );
//         res.setHeader(
//           "Content-Disposition",
//           'attachment; filename="custom_date_sales_report.xlsx"'
//         );

//         // Write the workbook to response
//         wb.writeToBuffer().then((buffer) => {
//           res.send(buffer);
//         });
//       }

//       if (pdfChecked == "true") {
//         const salesData = await Orderdb.aggregate([
//           {
//             $unwind: "$orderDetails", // Deconstruct the orderDetails array
//           },
//           {
//             $project: {
//               // Project the fields you want to include in the result
//               orderId: "$_id", // Include the orderId if needed
//               userId: 1, // Include other fields if needed
//               productName: "$orderDetails.pName",
//               pricePerUnit: "$orderDetails.price",
//               quantity: "$orderDetails.quantity",
//               paymentMethod: "$orderDetails.paymentMethod",
//               orderStatus: "$orderDetails.orderStatus",
//               orderDate: "$orderDetails.orderDate",
//               totalAmount: {
//                 $multiply: ["$orderDetails.price", "$orderDetails.quantity"],
//               }, // Calculate the total amount
//             },
//           },
//           {
//             $match: {
//               orderDate: {
//                 $gte: new Date(fromDate),
//                 $lte: new Date(toDate),
//               },
//             },
//           },
//         ]);

//         const totalCount = salesData.length;

//         const tableHeaders = [
//           "Order ID",
//           "Order Date",
//           "Product Name",
//           "Order Status",
//           "Quantity",
//           "Unit Price",
//           "Total Amount",
//         ];
//         const tableData = [];

//         salesData.forEach((order) => {
//           tableData.push([
//             order.orderId.toString().split("").slice(18, 24).join(""),
//             new Date(order.orderDate)
//               .toISOString()
//               .split("T")[0]
//               .split("-")
//               .reverse()
//               .join("-"),
//             order.productName,
//             order.orderStatus,
//             order.quantity,
//             order.pricePerUnit,
//             order.totalAmount,
//           ]);
//         });

//         const totalPrice = salesData.reduce((total, value) => {
//           return (total += value.totalAmount);
//         }, 0);

//         // Add total price as the last row
//         tableData.push([
//           "Total Sales Amount",
//           "",
//           "",
//           "",
//           "",
//           "",
//           totalPrice.toString(),
//         ]);

//         tableData.push([
//           "Total Sales Count",
//           "",
//           "",
//           "",
//           "",
//           "",
//           totalCount.toString(),
//         ]);

//         const doc = new PDFDocument();

//         res.setHeader("Content-Type", "application/pdf");
//         res.setHeader(
//           "Content-Disposition",
//           'attachment; filename="custom_date_sales_report.pdf"'
//         );

//         doc.pipe(res);

//         doc.fontSize(14).text("Sales Report", { align: "center" }).moveDown();

//         const tableOptions = {
//           title: "Sales Report",
//           headers: tableHeaders,
//           rows: tableData,
//         };

//         await doc.table(tableOptions);

//         doc.end();
//       }
//     }
//   } catch (error) {
//     console.error("Error generating custom date sales report:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

export async function customDateSales(req, res) {
  try {
    const { fromDate, toDate, pdfChecked, excelChecked, reportInterval } =
      req.body;
    console.log(req.body);

    const salesData = await Orderdb.aggregate([
      {
        $unwind: "$orderDetails", // Deconstruct the orderDetails array
      },
      {
        $project: {
          // Project the fields you want to include in the result
          orderId: "$_id", // Include the orderId if needed
          userId: 1, // Include other fields if needed
          productName: "$orderDetails.pName",
          pricePerUnit: "$orderDetails.price",
          quantity: "$orderDetails.quantity",
          paymentMethod: "$orderDetails.paymentMethod",
          orderStatus: "$orderDetails.orderStatus",
          orderDate: "$orderDetails.orderDate",
          totalAmount: {
            $multiply: ["$orderDetails.price", "$orderDetails.quantity"],
          }, // Calculate the total amount
        },
      },
      {
        $match: {
          orderDate: {
            $gte: new Date(fromDate),
            $lte: new Date(toDate),
          },
        },
      },
    ]);

    if (excelChecked == "true") {
      // Create a new Excel workbook
      const wb = new Excel.Workbook();
      const ws = wb.addWorksheet("Sales Report");

      // Define table headers
      const headers = [
        "Order ID",
        "Order Date",
        "Product Name",
        "Order Status",
        "Quantity",
        "Unit Price",
        "Total Amount",
      ];

      // Add headers to the Excel worksheet
      headers.forEach((header, index) => {
        ws.cell(1, index + 1).string(header);
      });

      // Populate data rows
      salesData.forEach((order, rowIndex) => {
        ws.cell(rowIndex + 2, 1).string(
          order.orderId.toString().split("").slice(18, 24).join("")
        );
        ws.cell(rowIndex + 2, 2).date(new Date(order.orderDate));
        ws.cell(rowIndex + 2, 3).string(order.productName);
        ws.cell(rowIndex + 2, 4).string(order.orderStatus);
        ws.cell(rowIndex + 2, 5).number(order.quantity);
        ws.cell(rowIndex + 2, 6).number(order.pricePerUnit);
        ws.cell(rowIndex + 2, 7).number(order.totalAmount);
      });

      // Calculate total sales amount
      const totalSalesAmount = salesData.reduce(
        (total, order) => total + order.totalAmount,
        0
      );

      // Add total sales amount row
      ws.cell(salesData.length + 2, 1).string("Total Sales Amount");
      ws.cell(salesData.length + 2, 7).number(totalSalesAmount);

      // Add total order count row
      ws.cell(salesData.length + 3, 1).string("Total Order Count");
      ws.cell(salesData.length + 3, 7).number(salesData.length);

      // Set up response headers for downloading
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="custom_date_sales_report.xlsx"'
      );

      // Write the workbook to response
      wb.writeToBuffer().then((buffer) => {
        res.send(buffer);
      });
    }

    if (pdfChecked == "true") {
      const salesData = await Orderdb.aggregate([
        {
          $unwind: "$orderDetails", // Deconstruct the orderDetails array
        },
        {
          $project: {
            // Project the fields you want to include in the result
            orderId: "$_id", // Include the orderId if needed
            userId: 1, // Include other fields if needed
            productName: "$orderDetails.pName",
            pricePerUnit: "$orderDetails.price",
            quantity: "$orderDetails.quantity",
            paymentMethod: "$orderDetails.paymentMethod",
            orderStatus: "$orderDetails.orderStatus",
            orderDate: "$orderDetails.orderDate",
            totalAmount: {
              $multiply: ["$orderDetails.price", "$orderDetails.quantity"],
            }, // Calculate the total amount
          },
        },
        {
          $match: {
            orderDate: {
              $gte: new Date(fromDate),
              $lte: new Date(toDate),
            },
          },
        },
      ]);

      const totalCount = salesData.length;

      const tableHeaders = [
        "Order ID",
        "Order Date",
        "Product Name",
        "Order Status",
        "Quantity",
        "Unit Price",
        "Total Amount",
      ];
      const tableData = [];

      salesData.forEach((order) => {
        tableData.push([
          order.orderId.toString().split("").slice(18, 24).join(""),
          new Date(order.orderDate)
            .toISOString()
            .split("T")[0]
            .split("-")
            .reverse()
            .join("-"),
          order.productName,
          order.orderStatus,
          order.quantity,
          order.pricePerUnit,
          order.totalAmount,
        ]);
      });

      const totalPrice = salesData.reduce((total, value) => {
        return (total += value.totalAmount);
      }, 0);

      // Add total price as the last row
      tableData.push([
        "Total Sales Amount",
        "",
        "",
        "",
        "",
        "",
        totalPrice.toString(),
      ]);

      tableData.push([
        "Total Sales Count",
        "",
        "",
        "",
        "",
        "",
        totalCount.toString(),
      ]);

      const doc = new PDFDocument();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="custom_date_sales_report.pdf"'
      );

      doc.pipe(res);

      doc.fontSize(14).text("Sales Report", { align: "center" }).moveDown();

      const tableOptions = {
        title: "Sales Report",
        headers: tableHeaders,
        rows: tableData,
      };

      await doc.table(tableOptions);

      doc.end();
    }
  } catch (error) {
    console.error("Error generating custom date sales report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
