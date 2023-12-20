const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productname:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    // images: [
    //     {
    //         items: {
    //             type: String
    //           }
    //     }
    // ],
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    // category: {
    //     type: String, 
    //     required: true
    // },
    

})

const Productdb = mongoose.model('productdb',productSchema);

module.exports = Productdb;