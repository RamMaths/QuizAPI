const mongoose = require('mongoose');
const User = require('../models/userModel');
const otpGenerator = require('../utils/otpGenerator');
const sendValidation = require('../utils/sendMail');

exports.signUp = async (req, res) => {
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

exports.login = async(req, res) => {
  try {
    const data = req.body;
    const user = await User.find({username: data.username});

    //validate the user
    const valid = await user[0].validPassword(data.password);

    if(valid) {
      //if valid genereate a new otp
      await User.findByIdAndUpdate(user[0].id, {otp: otpGenerator()}, {
        //set this to true to return the new updated document
        new: true,
        runValidators: true
      });
        
      //send otp 
      await sendValidation.call(user[0]);

      res.status(201).json({
        status: 'success',
      })
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
