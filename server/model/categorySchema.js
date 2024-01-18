import mongoose from 'mongoose';


const categorySchema = new mongoose.Schema({
  name: {
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