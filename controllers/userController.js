const mongoose = require('mongoose');
const User = require('../models/userModel');

exports.createUser = async (req, res) => {
  try {

    const new_user = new User({
      username: req.username,
      email: req.email
    });

    new_user.password = await new_user.generateHash(req.password);
    await new_user.save();

    res.status(201).json({
      status: 'success',
      data: new_user
    })

  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err.message
    })
  }
};
