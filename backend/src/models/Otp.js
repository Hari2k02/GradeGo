const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: false,
  },
});

module.exports = new mongoose.model('Login', OtpSchema);