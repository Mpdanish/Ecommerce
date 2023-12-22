import Userdb from '../model/userSchema.js';
import Categorydb from '../model/categorySchema.js';
import Productdb from '../model/productSchema.js';


export async function adminUsers (req,res) {
   const data=await Userdb.find()
   res.send(data)

}

export async function blockuser (req,res) {
   
   const data= await Userdb.updateOne({_id:req.query.userid},{$set:{status:false}})
   res.redirect('/adminUsers')
}

export async function unblockuser (req,res) {  
   
   const data= await Userdb.updateOne({_id:req.query.userid},{$set:{status:true}})
   res.redirect('/adminUsers')
}

export async function adminshowcategory (req,res) {
   const data=await Categorydb.find()
   res.send(data)

}

export async function addcategory (req,res) {
   try{
      const newCat=new Categorydb({
         categoryname:req.body.categoryName
      })
      await newCat.save()
      res.redirect('/adminCategory')
   }catch(error){
      res.send(error)
   }
}

export async function deleteCategory(req, res) {
   try {
      // const categoryId = req.params.id;

      const data= await Categorydb.updateOne({_id:req.query.categoryid},{$set:{isHidden:true}})

      res.redirect('/adminCategory');
   } catch (error) {
      res.send(error);
   }
}


export async function restoreCategory(req, res) {
   try {

      const data= await Categorydb.updateOne({_id:req.query.categoryid},{$set:{isHidden:false}})

      res.redirect('/adminCategory');
   } catch (error) {
      res.send(error);
   }
}

export async function addproduct (req,res) {
   try{
      const newCat=new Productdb({
         productname:req.body.productname,
         description:req.body.description,
         price:req.body.price,
         // images:req.body.images,
         stock:req.body.stock
      })
      await newCat.save()
      res.redirect('/adminProducts')
   }catch(error){
      res.send(error)
   }
}

export async function showproduct (req,res) {
   const data=await Productdb.find()
   res.send(data)
   // res.render('adminProducts',{data})
}