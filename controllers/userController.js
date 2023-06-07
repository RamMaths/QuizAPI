const User = require('../models/userModel');
const otpGenerator = require('../utils/otpGenerator');
const sendValidation = require('../utils/sendMail');

exports.signUp = async (req, res) => {
  const data = req.body;
  try {
    const new_user = new User({
      username: data.username,
      email: data.email,
      otp: otpGenerator(),
      picture: data.picture ? data.picture : ''
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
    let user = await User.find({email: data.email});

    //validate the user
    const valid = await user[0].validPassword(data.password);

    if(valid) {
      //if valid genereate a new otp
      user = await User.findByIdAndUpdate(user[0].id, {otp: otpGenerator()}, {
        //set this to true to return the new updated document
        new: true,
        runValidators: true
      });
        
      //send otp 
      await sendValidation.call(user);
      res.status(201).json({
        status: 'success',
        user: {
          username: user.username,
          picture: user.picture
        }
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


exports.validate = async(req, res) => {
  try {
    const data = req.body;
    const user = await User.find({email: data.email});
    //validate the otp that the user typed and the one
    //that is stored into the database
    if(data.otp === user[0].otp) {
      res.status(201).json({
        status: 'success',
        data: {
          username: user[0].username,
          picture: user[0].picture
        }
      });
    } else {
      throw new Error('OTP Is Invalid');
    }
  } catch(err) {
    res.status(404).json({
      status: 'failed',
      message: err.message
    });
  }
}
