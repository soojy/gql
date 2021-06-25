const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const { getUserId } = require('./utils');
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const Vote = require('./resolvers/Vote')
const Subscription = require('./resolvers/Subscription')
const { PubSub } = require('apollo-server')

const pubsub = new PubSub()

const resolvers = {
    Query,
    Mutation,
    Subscription,
    Vote,
    User,
    Link,
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: ({ req }) => {
        return {
            ...req,
            prisma,
            pubsub,
            userId:
                req && req.headers.authorization
                    ? getUserId(req)
                    : null
        };
    },
    subscriptions: {
        path: '/subscriptions',
        onConnect: (connectionParams, webSocket, context) => {
            console.log('Client connected');
        },
        onDisconnect: (webSocket, context) => {
            console.log('Client disconnected')
        },
    },
});

server
    .listen()
    .then(({ url }) =>
        console.log(`Server is running on ${url}`)
    );
