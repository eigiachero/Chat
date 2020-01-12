import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'

import schema from './schema'

import db from './models'

require('dotenv').config()

const port = process.env.PORT || 3001

const app = express()

const server = new ApolloServer({
  ...schema,
  instrospection: true,
  playground: true,
  tracing: true
})

server.applyMiddleware({ app })

const httpServer = createServer(app)

server.installSubscriptionHandlers(httpServer)

httpServer.listen({ port }, () => {
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
  console.log(
    `Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`
  )
})

//Sequelize usage test
const dummy_user = {
  firstName: "Ezequiel",
  lastName: "Giachero",
  username: "Eze123",
  salt: "",
  password: "pepito"
}

async function createShowDestroy(user){
  try{
    const create = await db.User.create(user)
    const show = await db.User.findAll()
    console.log("All users:", JSON.stringify(show, null, 4))
    const destoy = await db.User.destroy({where: {username: 'Eze123'} }).then(console.log('Done'))  
  }
  catch (error) {
    console.log(error)
  }
}

createShowDestroy(dummy_user)