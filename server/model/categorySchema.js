// const mongoose = require('mongoose');

import mongoose from 'mongoose';


const categorySchema = new mongoose.Schema({
  categoryname: {
    type: String,
    required: true,
    unique:true,
    },
  isHidden:{
    type: Boolean,
    default:false,
    }
});  


const Categorydb = mongoose.model('categorydb', categorySchema);

export default Categorydb;