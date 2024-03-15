import Coupondb from "../model/couponSchema.js";

export async function addCoupon(req, res) {
  try {
    const { couponCode, category, maxUse, priceLimit, coupondiscount, expiry } =
      req.body;
    const regexCode = new RegExp(couponCode, "i");

    const duplicate = await Coupondb.findOne({
      couponCode: { $regex: regexCode },
    });

    if (
      !couponCode ||
      !category ||
      !maxUse ||
      !priceLimit ||
      !coupondiscount ||
      !expiry
    ) {
      return res
        .status(500)
        .json({ errStatus: true, message: "Content cannot be empty" });
    }

    if (duplicate) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Coupon already exist" });
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
    let { couponCode, category, maxUse, priceLimit, coupondiscount, expiry } =
      req.body;
    const regexCode = new RegExp(couponCode, "i");
    // const duplicate = await Coupondb.findOne({
    //   couponCode: { $regex: regexCode },
    // });

    const duplicate = await Coupondb.findOne({
      couponCode: { $regex: new RegExp("^" + couponCode + "$", "i") },
      _id: { $ne: req.params.id }, // Exclude the current coupon being updated
    });

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
        $set: {
          couponCode,
          category,
          maxUse,
          priceLimit,
          coupondiscount,
          expiry,
        },
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

export async function checkCoupon(req, res) {
  const { couponCode, productPrice } = req.body;
  console.log(req.body);

  try {
    const coupon = await Coupondb.findOne({ couponCode: couponCode });

    if (!coupon) {
      // Coupon not found
      return res.json({
        isValid: false,
        message: "Invalid coupon code. Please try again.",
      });
    }

    // Check if coupon is expired
    if (coupon.expiry < Date.now()) {
      return res.json({ isValid: false, message: "Coupon has expired." });
    }

    // Check if product price is within the price limit defined by the coupon
    if (productPrice > coupon.priceLimit) {
      return res.json({
        isValid: false,
        message: "Product price exceeds coupon limit.",
      });
    }

    // Check if max use count has been exceeded
    if (coupon.maxUse <= 0) {
      return res.json({
        isValid: false,
        message: "Coupon has reached its maximum usage limit.",
      });
    }

    // Update max use count and save coupon
    coupon.maxUse--;
    await coupon.save();

    // Calculate discount and send it back to the client
    const discount = coupon.coupondiscount;
    return res.json({ isValid: true, discount });
  } catch (error) {
    console.error("Error checking coupon:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function deleteCoupon(req, res) {
  try {
    const couponId = req.params.id;
    const data = await Coupondb.findByIdAndUpdate(
      { _id: couponId },
      { $set: { isDeleted: true } }
    );
    console.log(data);
    res.status(201).json({ message: "Coupon Deleted" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
