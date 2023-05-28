const mongoose = require('mongoose');
const User = require('../models/userModel');
const otpGenerator = require('../utils/otpGenerator');

exports.createUser = async (req, res) => {
  const data = req.body;
  try {
    const new_user = new User({
      username: data.username,
      email: data.email,
      otp: otpGenerator()
    });
    
    new_user.password = await new_user.generateHash(data.password);
    await new_user.save();

    res.status(200).json({
      status: 'success',
      data: new_user
    });

  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err.message
    });
  }
};

exports.validateUser = async(req, res) => {
  try {
    const data = req.body;
    const user = await User.find({username: data.username});
    const valid = await user[0].validPassword(data.password);

    if(valid) {
      await User.findByIdAndUpdate(user[0].id, {otp: otpGenerator()}, {
        //set this to true to return the new updated document
        new: true,
        runValidators: true
      });
    } else {
      throw new Error('Credentials does not match');
    }

  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err.message
    });
  }
}
