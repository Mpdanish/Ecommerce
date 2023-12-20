const mongoose = require('mongoose');


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
    expires: 10, 
  },
});


const Otpdb = mongoose.model('otpdb', otpSchema);

module.exports = Otpdb;
