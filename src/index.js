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

passport.use(new JwtStrategy(opts,async function (jwtPayload, done) {
  const user = await models.user.findOne({where: { id: jwtPayload.sub }}) 
  
  return done(null, user)
}))

const app = express()

passport.initialize()

app.use('/graphql', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (user) {
      req.user = user
    }

    next()
  })(req, res, next)
})

const server = new ApolloServer({
  ...schema,
  context: ({ req }) => ({ models, secret: opts.secretOrKey, user: req.user }),
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


