import Categorydb from "../model/categorySchema.js";
import Coupondb from "../model/couponSchema.js";
import Productdb from "../model/productSchema.js";
import Userdb from "../model/userSchema.js";

export async function getAllCoupon (couponId = null, page = null) {
    try {
        const skip = Number(page)?(Number(page) - 1):0;
        // for updation of coupon we need details of the particular coupon
        if(couponId){
            if(!isObjectIdOrHexString(couponId)){
                return null;
            }
            return await Coupondb.findOne({_id: couponId});
        }
        return await Coupondb.find().skip((10 * skip)).limit(10);

    } catch (err) {
        throw err;
    }
}


// export async function getAllCategories (catId = null, page = null) {
//     try {
//         const skip = Number(page)?(Number(page) - 1):0;
//         // for updation of coupon we need details of the particular coupon
//         if(catId){
//             if(!isObjectIdOrHexString(catId)){
//                 return null;
//             }
//             return await Categorydb.findOne({_id: catId});
//         }
//         return await Categorydb.find().skip((10 * skip)).limit(10);

//     } catch (err) {
//         throw err;
//     }
// }


export async function getListedAllCategories(isHidden = false, page = 1, categoryId = null) {
    try {
        //for single category for updation
        if(categoryId){
            return await Categorydb.findOne({_id: categoryId})
        }
        const skip  = Number(page)?(Number(page) - 1):0;
        // if(search){
        //     return await Categorydb.find({isHidden}).skip((skip * 10)).limit(10);
        // }
        // if(forSelectBox){
        //     return await Categorydb.find({isHidden});
        // }
        return await Categorydb.find({isHidden}).skip((skip * 10)).limit(10);
    } catch (err) {
        throw err;
    }
}

export async function getUnlistedAllCategories(isHidden = true, page = 1, categoryId = null) {
    try {
        //for single category for updation
        if(categoryId){
            return await Categorydb.findOne({_id: categoryId})
        }
        const skip  = Number(page)?(Number(page) - 1):0;
        // if(search){
        //     return await Categorydb.find({isHidden}).skip((skip * 10)).limit(10);
        // }
        // if(forSelectBox){
        //     return await Categorydb.find({isHidden});
        // }
        return await Categorydb.find({isHidden}).skip((skip * 10)).limit(10);
    } catch (err) {
        throw err;
    }
}

export async function getAllUsers(page = 1){
    try {
        const skip = Number(page)?(Number(page) - 1):0;
        const agg = [
            {
                $skip: (10 * skip)
            },
            {
                $limit: 10
            }
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

export async function getListedProducts(status = false, page = 1){
    try {
        const skip = Number(page)?(Number(page) - 1):0;
        // flase to return all listed product and true to return all unlisted product
        const agg = [
            {
              $match: {
                isHidden: status,
              },
            },
            {
                $skip: (10 * skip)
            },
            {
                $limit: 10
            }
          ];
        return await Productdb.aggregate(agg);
    } catch (err) {
        throw err;
    }
}