const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [10, 'The name must have more than 10 characters'],
    maxlength: [40, 'The name must have less than 40 characters']
  },
  password: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  highscore: {
    type: Number,
    default: 0
  }
});

userSchema.methods.generateHash = async function(password) {
  const salt = await bcrypt.genSalt(13);
  bcrypt.hash(password, salt, function(err, hash) {
    return hash;
  });
};

userSchema.methods.validPassword = async function(password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};


const User = mongoose.model('User', userSchema);

module.exports = User;
