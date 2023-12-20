const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
  categoryname: {
    type: String,
    required: true,
    unique:true,
    },
  status:{
    type: Boolean,
    default:true
    }
});


const Categorydb = mongoose.model('categorydb', categorySchema);

module.exports = Categorydb;