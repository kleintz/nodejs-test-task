const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    }
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isMobilePhone(value)) {
        throw new Error('Phone is invalid')
      }
    }
  },
  location: {
    type: String
  },
  social: [
    {
      link: {
        type: String
      }
    }
  ]
})

const User = mongoose.model('User', userSchema)

module.exports = User
