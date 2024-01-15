import Userdb from "../model/userSchema.js";
import Categorydb from "../model/categorySchema.js";
import Productdb from "../model/productSchema.js";
import cloudinaryUploadImage from "../helper/cloudinary.js";

export async function adminUsers(req, res) {
  try {
    const data = await Userdb.find();
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function blockuser(req, res) {
  try {
    const data = await Userdb.updateOne(
      { _id: req.query.userid },
      { $set: { status: false } }
    );
    res.status(200).redirect("/adminUsers");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function unblockuser(req, res) {
  try {
    const data = await Userdb.updateOne(
      { _id: req.query.userid },
      { $set: { status: true } }
    );
    res.status(200).redirect("/adminUsers");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function adminshowcategory(req, res) {
  try {
    const data = await Categorydb.find();
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function addcategory(req, res) {
  try {
    const newCat = new Categorydb({
      categoryname: req.body.categoryName,
    });
    await newCat.save();
    res.status(200).redirect("/adminCategory");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function deleteCategory(req, res) {
  try {
    const data = await Categorydb.updateOne(
      { _id: req.body.id },
      { $set: { isHidden: true } }
    );

    if (data) res.status(200).send(false);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function restoreCategory(req, res) {
  try {
    const data = await Categorydb.updateOne(
      { _id: req.body.id },
      { $set: { isHidden: false } }
    );
    if (data) res.status(200).send(true);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function addproduct(req, res) {
  try {
    let { productname, description, price, stock, ImageArr, category } =
      req.body;
    (stock = parseInt(stock)), (price = parseInt(price));

    const url = await cloudinaryUploadImage(ImageArr);

    const newCat = new Productdb({
      productname,
      description,
      price,
      stock,
      images: url,
      category,
    });
    const val = await newCat.save();
    if (val) res.status(200).send(true);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function showproduct(req, res) {
  try {
    const data = await Productdb.find();
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function editproduct(req, res) {
  try {
    const data = await Productdb.findOne({ _id: req.params.id });
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function updateproduct(req, res) {
  try {
    let { productname, description, price, stock, images, category } = req.body;

    await Productdb.updateOne(
      { _id: req.params.id },
      {
        $set: {
          productname,
          description,
          price,
          stock,
          category,
        },
      }
    );

    if (images.length > 0) {
      await Productdb.updateOne(
        { _id: req.params.id },
        { $push: { images: images } },
        { upsert: true }
      );
    }
    res.status(200).send(true);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
