// const mongoose = require('mongoose');

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productname:{
        type:String,
        required:true,
        unique:true,
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    images:{
        type:Array,
        required:true,
    },
    category: {
        type: String,
        required: true
    },
    

})

const Productdb = mongoose.model('productdb',productSchema);

export default Productdb;