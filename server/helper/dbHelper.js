import Categorydb from "../model/categorySchema.js";
import Coupondb from "../model/couponSchema.js";
import Orderdb from "../model/orderSchema.js";
import Productdb from "../model/productSchema.js";
import Userdb from "../model/userSchema.js";

export async function getAllCoupon(couponId = null, page = null) {
  try {
    const skip = Number(page) ? Number(page) - 1 : 0;
    // for updation of coupon we need details of the particular coupon
    if (couponId) {
      if (!isObjectIdOrHexString(couponId)) {
        return null;
      }
      return await Coupondb.findOne({ _id: couponId,isDeleted:false });
    }
    return await Coupondb.find({isDeleted:false})
      .skip(10 * skip)
      .limit(10);
  } catch (err) {
    throw err;
  }
}

export async function getAllDeletedCoupons(couponId = null, page = null) {
  try {
    const skip = Number(page) ? Number(page) - 1 : 0;
    // for updation of coupon we need details of the particular coupon
    if (couponId) {
      if (!isObjectIdOrHexString(couponId)) {
        return null;
      }
      return await Coupondb.findOne({ _id: couponId,isDeleted:true });
    }
    return await Coupondb.find({isDeleted:true})
      .skip(10 * skip)
      .limit(10);
  } catch (err) {
    throw err;
  }
}

export async function getListedAllCategories(
  isHidden = false,
  page = 1,
  categoryId = null
) {
  try {
    //for single category for updation
    if (categoryId) {
      return await Categorydb.findOne({ _id: categoryId });
    }
    const skip = Number(page) ? Number(page) - 1 : 0;
    // if(search){
    //     return await Categorydb.find({isHidden}).skip((skip * 10)).limit(10);
    // }
    // if(forSelectBox){
    //     return await Categorydb.find({isHidden});
    // }
    return await Categorydb.find({ isHidden })
      .skip(skip * 10)
      .limit(10);
  } catch (err) {
    throw err;
  }
}

export async function getUnlistedAllCategories(
  isHidden = true,
  page = 1,
  categoryId = null
) {
  try {
    //for single category for updation
    if (categoryId) {
      return await Categorydb.findOne({ _id: categoryId });
    }
    const skip = Number(page) ? Number(page) - 1 : 0;
    // if(search){
    //     return await Categorydb.find({isHidden}).skip((skip * 10)).limit(10);
    // }
    // if(forSelectBox){
    //     return await Categorydb.find({isHidden});
    // }
    return await Categorydb.find({ isHidden })
      .skip(skip * 10)
      .limit(10);
  } catch (err) {
    throw err;
  }
}

export async function getAllUsers(page = 1) {
  try {
    const skip = Number(page) ? Number(page) - 1 : 0;
    const agg = [
      {
        $skip: 10 * skip,
      },
      {
        $limit: 10,
      },
    ];

    //if there is search filtered users
    // if(search){
    //     agg.splice(0, 0, {
    //         $match:{
    //             $or: [
    //                 { fullName: { $regex: search, $options: "i" } },
    //                 { email: { $regex: search, $options: "i" } },
    //             ],
    //         }
    //     });
    // }

    return await Userdb.aggregate(agg);
  } catch (err) {
    throw err;
  }
}

export async function getListedProducts(status = false, page = 1) {
  try {
    const skip = Number(page) ? Number(page) - 1 : 0;
    // flase to return all listed product and true to return all unlisted product
    const agg = [
      {
        $match: {
          isHidden: status,
        },
      },
      {
        $skip: 10 * skip,
      },
      {
        $limit: 10,
      },
    ];
    return await Productdb.aggregate(agg);
  } catch (err) {
    throw err;
  }
}

export async function getUnlistedProducts(status = true, page = 1) {
  try {
    const skip = Number(page) ? Number(page) - 1 : 0;
    // flase to return all listed product and true to return all unlisted product
    const agg = [
      {
        $match: {
          isHidden: status,
        },
      },
      {
        $skip: 10 * skip,
      },
      {
        $limit: 10,
      },
    ];
    return await Productdb.aggregate(agg);
  } catch (err) {
    throw err;
  }
}

export async function getAllOrders(page = 1, sales = null) {
  try {
    const skip = Number(page) ? Number(page) - 1 : 0;
    const agg = [
      {
        $unwind: "$orderDetails",
      },
      {
        $lookup: {
          from: Userdb.collection.name,
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
    ];

   

    if (!sales) {
      agg.push(
        {
          $skip: 10 * skip,
        },
        {
          $limit: 10,
        }
      );
    }

    // return all documents after aggregating
    return await Orderdb.aggregate(agg);
  } catch (err) {
    throw err;
  }
}
