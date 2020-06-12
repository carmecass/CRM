const mongoose = require('mongoose')

const OrderSchema = mongoose.Schema({
  order: {
    type: Array,
    require: true,
  },
  total: {
    type: Number,
    require: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId, 
    require: true,
    ref: 'Client'
  },
  salesman: {
    type: mongoose.Schema.Types.ObjectId, 
    require: true,
    ref: 'User'
  },
  stage: {
    type: String,
    default: "PENDENT"
  },
  date_creation: {
    type: Date,
    default: Date.now()
  },
})
module.exports = mongoose.model('Order', OrderSchema)