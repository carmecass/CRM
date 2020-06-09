const { gql } = require('apollo-server')
//a graphql no existeix token per això fem un type Token

const typeDefs = gql`
type User {
  id: ID
  name: String
  surname: String
  email: String
  date_creation: String
}
type Token {
  token: String
}
type Product {
  id: ID
  name: String
  stock: Int
  price: Float
  date_creation: String
}
type Client {
  id: ID
  name: String
  surname:String
  company: String
  email: String
  phone: String
  salesman: ID
}
type OrderProduct {
  id: ID
  quantity: Int
  name: String
  price: Float
}
type Order {
  id: ID
  order: [OrderProduct]
  total: Float
  client: Client
  salesman: ID!
  stage: OrderStage
  date_creation: String
}
type TopClients {
  total: Float
  client: [Client]
}
type TopSalesmans {
  total: Float
  salesman: [User]
}
input UserInput {
  name: String!
  surname: String
  email: String
  password: String
}
input AuthenticateInput {
  email: String!
  password: String!
}
input ProductInput {
  name: String!
  stock: Int!
  price: Float!
}
# No pasem el venedor per què el passarem per context, ja que serà l'usuari autenticat
input ClientInput {
  name: String!
  surname:String!
  company: String!
  email: String!
  phone: String
}
input OrderProductInput {
  id: ID
  quantity: Int
  name: String
  price: Float
}
input OrderInput {
  order: [OrderProductInput]
  total: Float
  client: ID
  stage: OrderStage
}
enum OrderStage {
  ACABADA
  PENDENT
  CANCELADA
}
type Query {
  #Usuaris
  # getUser(token: String!) : User
  getUser: User

  #Productes
  getProducts: [Product]
  getProduct(id: ID!) : Product

  #Clients
  getClient(id: ID!) : Client
  getClients: [Client]
  getClientsBySalesman: [Client]

  #Comandes
  getOrder(id:ID!) : Order
  getOrders: [Order]
  getOrdersBySalesman: [Order]
  getOrdersByStage(stage: String!): [Order]

  #Cerques avançades
  getBestClients: [TopClients]
  getBestSalesmans: [TopSalesmans]
  searchProductByName(text: String!) : Product
}

type Mutation {
  #Usuaris
  newUser(input:UserInput) : User
  userAuthenticate(input: AuthenticateInput): Token

  #Productes
  newProduct(input: ProductInput) : Product
  updateProduct(id: ID!, input: ProductInput) : Product
  deleteProduct(id: ID!) : String

  #Clients
  newClient(input: ClientInput) : Client
  updateClient(id: ID!, input: ClientInput) : Client
  deleteClient(id: ID!) : String

  #Comandes
  newOrder(input: OrderInput) : Order
  updateOrder(id: ID!, input: OrderInput) : Order
  deleteOrder(id: ID!) : String
}
`;

module.exports = typeDefs;