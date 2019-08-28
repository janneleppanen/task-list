const { ApolloServer } = require("apollo-server-express");

const db = require("./db");
const Query = require("../resolvers").Query;
const Mutation = require("../resolvers").Mutation;
const User = require("../users/users.resolvers").User;
const typeDefs = require("./typeDefs");

const resolvers = {
  Query,
  Mutation,
  User
};

const createServer = () =>
  new ApolloServer({
    typeDefs,
    resolvers,
    context: req => ({ ...req, db })
  });

module.exports = createServer;
