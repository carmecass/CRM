const mongoose = require('mongoose')

const ClientSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true
  },
  surname: {
    type: String,
    require: true,
    trim: true
  },
  company: {
    type: String,
    require: true,
    trim: true
  },
  email: {
    type: String,
    require: true,
    trim: true,
    unique: true
  },
  phone: {
    type: String,
    trim: true
  },
  date_creation: {
    type: Date,
    default: Date.now()
  },
  salesman: {
    type: mongoose.Schema.Types.ObjectId, 
    require: true,
    ref: 'User'
  }
})
module.exports = mongoose.model('Client', ClientSchema)