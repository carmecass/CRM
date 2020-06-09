const mongoose = require('mongoose');
require('dotenv').config();

const {env: {PORT, MONGO_URL : url}, argv: [, , port = PORT || 4000], } = process;
// const {env: {PORT, MONGODB_URI : url}, argv: [, , port = PORT || 4000], } = process;

const conectDB =  () => {
    try {
         mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('DB Conectada');
    } catch (error) {
        console.log('Hi ha hagut un error');
        console.log(error);
        process.exit(1); 
    }
}

module.exports = conectDB;