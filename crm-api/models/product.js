const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true
  },
  stock: {
    type: Number,
    require: true,
    trim: true
  },
  price: {
    type: Number,
    require: true,
    trim: true
  },
  date_creation: {
    type: Date,
    default: Date.now()
  }
})

ProductSchema.index({name: 'text'})

module.exports = mongoose.model('Product', ProductSchema)