import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    phoneNumber:{
        type:Number,
        required: true,
    },
    password:{
        type:String
    },
    confirmpassword:{
        type:String
    },
    verified: { 
        type: Boolean, 
        default: false 
    },
    status:{
        type: Boolean,
        default:true
    },
    
})

const Userdb = mongoose.model('userdb',userSchema);

export default Userdb