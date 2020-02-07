import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'

import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

import schema from './schema'
import models from './models'

require('dotenv').config()

const port = process.env.PORT || 3001

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET || 'secret'

passport.use(new JwtStrategy(opts, function (jwtPayload, done) {
  models.user.findOne({ id: jwtPayload.sub }, function (err, user) {
    if (err) {
      return done(err, false)
    }

    if (user) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  })
}))

const app = express()

const server = new ApolloServer({
  ...schema,
  context: { models, secret: opts.secretOrKey },
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
