import Categorydb from "../model/categorySchema.js";
import Offerdb from "../model/offerSchema.js";
import Productdb from "../model/productSchema.js";

export async function CategoryOffer(req, res) {
  try {
    const { name, discount, expiry } = req.body;
    const regexName = new RegExp(name, "i");
    const duplicate = await Offerdb.findOne({ name: { $regex: regexName } });
    if (duplicate) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Offer already exist" });
    }
    if (!name || !discount || !expiry) {
      res.status(500).json({ message: "Content cannot be empty" });
      return;
    }
    const newOffer = new Offerdb({
      name,
      type: "Category Offer",
      discount,
      expiry,
    });

    await newOffer.save();

    await Categorydb.updateOne(
      { name: regexName },
      { $set: { offer: newOffer._id } }
    );
    res.status(201).json({ message: "Offer Added" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function ProductOffer(req, res) {
  try {
    const { name, discount, expiry } = req.body;
    const regexName = new RegExp(name, "i");
    const duplicate = await Offerdb.findOne({ name: { $regex: regexName } });
    if (duplicate) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Offer already exist" });
    }
    if (!name || !discount || !expiry) {
      res.status(500).json({ message: "Content cannot be empty" });
      return;
    }
    const newOffer = new Offerdb({
      name,
      type: "Product Offer",
      discount,
      expiry,
    });
    await newOffer.save();

    await Productdb.updateMany(
      { name: regexName },
      { $set: { offer: newOffer._id } }
    );
    res.status(201).json({ message: "Offer Added" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function deleteOffer(req, res) {
  try {
    const id = req.params.id;
    await Offerdb.findByIdAndDelete(id);
    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateOffer(req, res) {
  try {
    let { name, discount, expiry } = req.body;
    // const regexName = new RegExp(name, 'i');
    // const duplicate = await Offerdb.findOne({ name: { $regex: regexName } });

    if (!name) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Field is Required" });
    }

    if (!discount) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Enter Discount" });
    }

    if (!expiry) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Select the Date" });
    }

    // if (duplicate) {
    //   return res
    //     .status(401)
    //     .json({ errStatus: true, message: "Offer already exist" });
    // }

    const newOffer = await Offerdb.updateOne(
      { _id: req.params.id },
      {
        $set: { name, discount, expiry },
      }
    );

    if (newOffer) {
      res.status(201).json({ message: "Offer Updated" });
    }

    // console.log(newcat);

    // res.status(200).send(true);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
