const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [8, 'The name must have more than 8 characters'],
    maxlength: [20, 'The name must have less than 40 characters']
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  picture: {
    type: String,
    required: false,
    unique: false,
    default: '',
  },
  highscore: {
    type: Number,
    default: 0
  },
  otp: {
    type: String,
    required: true
  }
});

const getHash = (salt, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, function(err, hash) {
      if(err) reject(err);
      else resolve(hash);
    });
  })
}

userSchema.methods.generateHash = async function(password) {
  const salt = await bcrypt.genSalt(13);
  const newPass = await getHash(salt, password);
  return newPass;
};

userSchema.methods.validPassword = async function(password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};


module.exports = mongoose.model('User', userSchema); 
