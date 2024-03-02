import Coupondb from "../model/couponSchema.js";

export async function addCoupon(req, res) {
  try {
    const { couponCode, category, maxUse, priceLimit, coupondiscount, expiry } =
      req.body;
    const regexCode = new RegExp(couponCode, "i");
    const duplicate = await Coupondb.findOne({ code: { $regex: regexCode } });
    if (duplicate) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Coupon already exist" });
    }
    if (
      !couponCode ||
      !category ||
      !maxUse ||
      !priceLimit ||
      !coupondiscount ||
      !expiry
    ) {
      res.status(500).json({ message: "Content cannot be empty" });
      return;
    }
    const newCoupon = new Coupondb({
      couponCode,
      category,
      maxUse,
      priceLimit,
      coupondiscount,
      expiry,
    });

    await newCoupon.save();

    res.status(201).json({ message: "Coupon Added" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function updateCoupon(req, res) {
  try {
    let { couponCode, category, maxUse, priceLimit, coupondiscount, expiry } = req.body;
    const regexCode = new RegExp(couponCode, 'i');
    const duplicate = await Coupondb.findOne({ code: { $regex: regexCode } });

    if (!couponCode) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Field is Required" });
    }

    if (!category) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Field is Required" });
    }

    if (!maxUse) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Field is Required" });
    }

    if (!priceLimit) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Field is Required" });
    }

    if (!coupondiscount) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Enter Discount" });
    }

    if (!expiry) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Select the Date" });
    }

    if (duplicate) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Coupon already exist" });
    }


    const newCoupon = await Coupondb.updateOne(
      { _id: req.params.id },
      {
        $set: { couponCode, category, maxUse, priceLimit, coupondiscount, expiry },
      }
    );
    if (newCoupon) {
      res.status(201).json({ message: "Coupon Updated" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
