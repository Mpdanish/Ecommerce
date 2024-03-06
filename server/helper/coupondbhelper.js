import Coupondb from "../model/couponSchema.js";

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