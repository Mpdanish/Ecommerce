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
    const { name } = req.body;
    const dupcategory = await Categorydb.findOne({ name: name.toUpperCase() });

    if (!name) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Enter Category Name" });
    }

    if (dupcategory) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Category already exist" });
    }

    const newCat = new Categorydb({
      name: name.toUpperCase(),
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
    let { name, description, price, stock, ImageArr, category } = req.body;
    (stock = parseInt(stock)), (price = parseInt(price));

    if ( !name || !description || !price || !stock || !ImageArr || !category ) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Content cannot be empty" });
    }

    const catID = await Categorydb.findById(category);

    const url = await cloudinaryUploadImage(ImageArr);

    const newCat = new Productdb({
      name,
      description,
      price,
      stock,
      images: url,
      category: catID,
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

export async function showdeletedproduct(req, res) {
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

    const url = await cloudinaryUploadImage(images);

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

    await Productdb.updateOne(
      { _id: req.params.id },
      { $push: { images: { $each: url } } },
      { upsert: true }
    );

    res.status(200).send(true);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function deleteImage(req, res) {
  try {
    const imagePublicId = req.params.id;
    const { productid } = req.params;
    await Productdb.updateOne(
      { _id: productid },
      {
        $unset: {
          [`images.${Number(imagePublicId)}`]: 1,
        },
      }
    );

    await Productdb.findOneAndUpdate(
      { _id: productid },
      {
        $pull: {
          images: null,
        },
      }
    );

    res.status(200).send(true);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting image reference");
  }
}

export async function deleteProduct(req, res) {
  try {
    const data = await Productdb.updateOne(
      { _id: req.body.id },
      { $set: { isHidden: true } }
    );

    if (data) res.status(200).send(false);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function restoreProduct(req, res) {
  try {
    const data = await Productdb.updateOne(
      { _id: req.body.id },
      { $set: { isHidden: false } }
    );

    if (data) res.status(200).send(true);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
