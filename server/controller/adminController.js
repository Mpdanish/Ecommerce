const Userdb = require('../model/userSchema');
const Categorydb = require('../model/categorySchema');
const Productdb = require('../model/productSchema');

exports.adminUser=async(req,res)=>{
   const data=await Userdb.find()
   res.send(data)

}

exports.blockuser= async(req,res)=>{
   
   const data= await Userdb.updateOne({_id:req.query.userid},{$set:{status:false}})
   res.redirect('/adminUsers')
}

exports.unblockuser= async(req,res)=>{  
   
   const data= await Userdb.updateOne({_id:req.query.userid},{$set:{status:true}})
   res.redirect('/adminUsers')
}

exports.adminshowcategory=async(req,res)=>{
   const data=await Categorydb.find()
   res.send(data)

}

exports.addcategory = async(req,res)=>{
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

exports.addproduct = async(req,res)=>{
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