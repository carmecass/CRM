const mongoose = require('mongoose')
// trim elimina els espais de l'inici i al final
const UserSchema = mongoose.Schema({
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
  email: {
    type: String,
    require: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    require: true,
    trim: true
  },
  date_creation: {
    type: Date,
    default: Date.now()
  }
}) 
module.exports = mongoose.model('User', UserSchema)