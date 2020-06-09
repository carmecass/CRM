const { ApolloServer } = require('apollo-server')
const typeDefs = require('./data/schema')
const resolvers = require('./data/resolvers')
const conectDB = require('./config/db');
require('dotenv').config({ path: '.env' });
const jwt = require('jsonwebtoken')

const {env: {PORT, MONGO_URL : url}, argv: [, , port = PORT || 4000], } = process;
// const {env: {PORT, MONGODB_URI : url}, argv: [, , port = PORT || 4000], } = process;

conectDB()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {

    const { env: { SECRET_WORD } } = process
    const token = req.headers['authorization'] || '';
    if(token) {
        try {
            const user = jwt.verify(token.replace('Bearer ', ''), SECRET_WORD );
            return { user}
      } catch (error) {
        console.log(error);
        console.log("Hi ha hagut un error");
      }
    }
  }
})

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`El servidor està funcionant ${url}`);
})