const User = require('../models/user')
const Product = require('../models/product')
const Client = require('../models/client')
const Order = require('../models/order')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const { env: { SECRET_WORD } } = process

const createToken = (user, secret, expiresIn) => {
  const { id, name, surname, email, date_creation } = user
  return jwt.sign({ id, name, surname, email, date_creation }, secret, { expiresIn })
}

const resolvers = {

  Query: {
    getUser: async (_, { }, ctx) => {
      return ctx.user
    },

    getProduct: async (_, { id }) => {
      const product = await Product.findById(id)
      if (!product) throw new Error(`Aquest producte no existeix`)
      return product
    },

    getProducts: async () => {
      try {
        const products = await Product.find({}).sort({name: 1})
        return products
      } catch (error) {
        console.log(error);
      }
    },

    getClient: async (_, { id }, ctx) => {
      const client = await Client.findById(id)
      if (!client) throw new Error('Aquest client no existeix')
      if (client.salesman.toString() !== ctx.user.id) {
        throw new Error('No tens autorització per veure aquest client')
      } else return client
    },

    getClients: async () => {
      try {
        const clients = await Client.find({})
        return clients
      } catch (error) {
        console.log(error);
      }
    },

    getClientsBySalesman: async (_, {}, ctx) => {
      try {
        const clients = await Client.find({ salesman: ctx.user.id.toString() }).sort({company: 1 })
        return clients
      } catch (error) {
        throw new Error("Hi ha hagut un error")
      }
    },

    getOrder: async (_, { id }, ctx) => {
      const order = await Order.findById(id)
      if (!order) throw new Error('Aquesta comanda no existeix')
      if (order.salesman.toString() !== ctx.user.id) {
        throw new Error('No tens autorització per veure aquesta comanda')
      } else return order
    },
    
    getOrders: async () => {
      try {
        return await Order.find({})
      } catch (error) {
        console.log(error);
      }
    },

    getOrdersBySalesman: async (_, { }, ctx) => {
      try {
        const orders = await Order.find({ salesman: ctx.user.id }).populate('client')
        return orders
      } catch (error) {
        console.log(error);
      }
    },

    getOrdersByStage: async (_, { stage }, ctx) => {
      const orders = await Order.find({ salesman: ctx.user.id, stage })
      return orders
    },

    getBestClients: async () => {
      const clients = await Order.aggregate([

        { $match: { stage: "ACABADA" } },
        {
          $group: {
            _id: "$client",
            total: { $sum: '$total' }
          }
        },
        {
          $lookup: {
            from: 'clients',
            localField: '_id',
            foreignField: "_id",
            as: "client"
          }
        },
        { $limit: 10 },
        { $sort: { total: -1 } },
      ])
      return clients
    },

    getBestSalesmans: async () => {
      const salesmans = await Order.aggregate([
        { $match: { stage: "ACABADA" } },
        {
          $group: {
            _id: '$salesman',
            total: { $sum: '$total' }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'salesman'
          }
        },
        { $limit: 10 },
        { $sort: { total: -1 } }
      ])
      return salesmans
    },

    searchProductByName: async (_, { text }) => {
      const regex = new RegExp(text, 'i')
      const products = await Product.find({ $text: { $search: regex } }).limit(10)
      return products
    },

  },

  Mutation: {
    newUser: async (_, { input }) => {
      const { email, password } = input

      const userExists = await User.findOne({ email })
      if (userExists) throw new Error(`L'usuari ja està registrat`)

      const salt = await bcryptjs.genSalt(10)
      input.password = await bcryptjs.hash(password, salt)
      try {
        const newUser = new User(input)
        const user = await newUser.save()
        return user
      } catch (error) {
        console.log(error);
      }
    },

    userAuthenticate: async (_, { input }) => {
      const { email, password } = input
      const user = await User.findOne({ email })
      if (!user) throw new Error(`Aquest usuari no està registrat`)

      const verifyPassword = await bcryptjs.compare(password, user.password)
      if (!verifyPassword) {
        throw new Error(`El password és incorrecte`)
      }
      const correctPassword = await bcryptjs.compare(password, user.password);
      if (!correctPassword) {
        throw new Error('El password no és correcte');
      }
      return {
        token: createToken(user, SECRET_WORD, '24h')
      }

    },

    newProduct: async (_, { input }) => {
      try {
        const newProduct = new Product(input)
        const product = await newProduct.save()
        return product
      } catch (error) {
        console.log(error)
      }
    },

    updateProduct: async (_, { id, input }) => {
      let product = await Product.findById(id)
      if (!product) throw new Error(`Aquest producte no s'ha trobat`)
      else {
        product = await Product.findByIdAndUpdate({ _id: id }, input, { new: true })
        return product
      }
    },

    deleteProduct: async (_, { id }) => {
      let product = await Product.findById(id)
      if (!product) {
        throw new Error(`Aquest producte no s'ha trobat`)
      } else {
        await Product.findOneAndDelete({ _id: id })
        return `El producte ${product.name} s'ha eliminat`
      }
    },
    newClient: async (_, { input }, ctx) => {

      const { email } = input
      const clientExists = await Client.findOne({ email })
      if (clientExists) {
        throw new Error('Aquest client ja existeix')
      }
      const newClient = new Client(input)
      newClient.salesman = ctx.user.id

      try {
        const client = await newClient.save()
        return client
      } catch (error) {
        console.log(error);
      }
    },

    updateClient: async (_, { id, input }, ctx) => {
      let client = await Client.findById(id)
      if (!client) {
        throw new Error('Aquest client no existeix')
      } else {
        if (client.salesman.toString() !== ctx.user.id) {
          throw new Error('No tens autorització per veure aquest client')
        } else {
          client = await Client.findByIdAndUpdate({ _id: id }, input, { new: true })
          return client
        }
      }
    },

    deleteClient: async (_, { id }, ctx) => {
      let client = await Client.findById(id)
      if (!client) {
        throw new Error('Aquest client no existeix')
      } else {
        if (client.salesman.toString() !== ctx.user.id) {
          throw new Error('No tens autorització per eliminar aquest client')
        } else {
          await Client.findOneAndDelete({ _id: id })
          return `El Client ${client.name} ${client.surname} s'ha eliminat`
        }
      }
    },

    newOrder: async (_, { input }, ctx) => {
      const { client } = input
      let clientExists = await Client.findById(client)

      if (!clientExists) {
        throw new Error('Aquest client no existeix')
      } else {
        if (clientExists.salesman.toString() !== ctx.user.id) {
          throw new Error('No tens autorització per treballar amb aquest client')
        }
      }
      for await (let item of input.order) {
        const { id } = item
        const product = await Product.findById(id)

        if (item.quantity > product.stock) {
          throw new Error(`De l'article: ${product.name}, només hi ha ${product.stock} unitats en stock`)
        } else {
          product.stock = product.stock - item.quantity
          await product.save()
        }
        let newOrder = new Order(input)

        newOrder.salesman = ctx.user.id
        const order = await newOrder.save()
        return order
      }
    },

    updateOrder: async (_, { id, input }, ctx) => {
      const order = await Order.findById(id)

      if (!order) {
        throw new Error('Aquesta comanda no existeix')
      }
      const clientExists = await Client.findById(order.client)
      if (!clientExists) { throw new Error('Aquest client no existeix') }

      if (order.salesman.toString() !== ctx.user.id) {
        throw new Error('No tens autorització per modificar aquesta comanda')
      }
      if (input.order) {
        for await (let item of input.order) {
          const { id } = item
          const product = await Product.findById(id)
          if (item.quantity > product.stock) {
            throw new Error(`De l'article: ${product.name}, només hi ha ${product.stock} unitats en stock`)
          } else {
            product.stock = product.stock - item.quantity
            await product.save()
          }
        }
      }
      return await Order.findOneAndUpdate({ _id: id }, input, { new: true })
    },

    deleteOrder: async (_, { id }, ctx) => {
      const order = await Order.findById(id)

      if (!order) throw new Error('Aquesta comanda no existeix')
      if (order.salesman.toString() !== ctx.user.id) {
        throw new Error('No tens autorització per eliminar aquesta comanda')
      } else {
        for await (let item of order.order) {
          const { id, quantity } = item
          const product = await Product.findById(id)
          product.stock = product.stock + quantity
          await product.save()
        }

        await Order.findOneAndDelete({ _id: id })
        return `La comanda ${id} ha sigut eliminada`
      }
    },
  }
}
module.exports = resolvers