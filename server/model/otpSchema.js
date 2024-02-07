// const mongoose = require('mongoose');

import mongoose from 'mongoose';


const otpSchema = new mongoose.Schema({
  email: {
    type: String, 
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 30,
  },
});


const Otpdb = mongoose.model('otpdb', otpSchema);

export default Otpdb;
