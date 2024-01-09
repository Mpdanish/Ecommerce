import Userdb from "../model/userSchema.js";
import Categorydb from "../model/categorySchema.js";
import Productdb from "../model/productSchema.js";
import cloudinaryUploadImage from "../helper/cloudinary.js";

export async function adminUsers(req, res) {
  try {
    const data = await Userdb.find();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error" );
  }
}

export async function blockuser(req, res) {
  const data = await Userdb.updateOne(
    { _id: req.query.userid },
    { $set: { status: false } }
  );
  res.redirect("/adminUsers");
}

export async function unblockuser(req, res) {
  const data = await Userdb.updateOne(
    { _id: req.query.userid },
    { $set: { status: true } }
  );
  res.redirect("/adminUsers");
}

export async function adminshowcategory(req, res) {
  const data = await Categorydb.find();
  res.send(data);
}

export async function addcategory(req, res) {
  try {
    const newCat = new Categorydb({
      categoryname: req.body.categoryName,
    });
    await newCat.save();
    res.redirect("/adminCategory");
  } catch (error) {
    res.send(error);
  }
}

export async function deleteCategory(req, res) {
  try {
    const data = await Categorydb.updateOne(
      { _id: req.body.id },
      { $set: { isHidden: true } }
    );

    if (data) res.send(false);
  } catch (error) {
    res.send(error);
  }
}

export async function restoreCategory(req, res) {
  try {
    const data = await Categorydb.updateOne(
      { _id: req.body.id },
      { $set: { isHidden: false } }
    );
    if (data) res.send(true);
  } catch (error) {
    res.send(error);
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
    if (val) res.send(true);
  } catch (error) {
    res.send(error);
    // console.error("Error saving product:");
    // res.status(500).send("Error occurred while saving the product.");
  }
}

export async function showproduct(req, res) {
  const data = await Productdb.find();
  res.send(data);
  // res.render('adminProducts',{data})
}

export async function editproduct(req, res) {
  const data = await Productdb.findOne({ _id: req.params.id });
  res.send(data);
  // res.render('adminProducts',{data})
}

export async function updateproduct(req, res) {

   console.log(req.body);

   try{

    let { productname, description, price, stock, images, category } =
      req.body;

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

    if(images.length > 0){
      await Productdb.updateOne({ _id: req.params.id }, {$push:{images: images}}, {upsert: true});
    }
    res.send(true);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Internal Server Error");
  }

}
  

