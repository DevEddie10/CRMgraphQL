const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers')
const connectDB = require('./config/db')
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env'});

// Conectar a la base de datos
connectDB();

// Servidor
const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    context: ({ req }) => {
        const token = req.headers['authorization'] || '';

        if (token) {
            try {
                const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET);
                return {
                    usuario
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
 });

// Arrancar el servidor
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`Server ready at ${url}`);
});