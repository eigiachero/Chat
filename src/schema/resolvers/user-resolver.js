import * as user from '../../controllers/graphql/user-controller'

export default {
  Query: {
    users: (parent, args, { db }) => db.user.findAll(),
    user: (parent, { id }, { db }) => db.user.findByPk(id)
  },
  Mutation: {
    createUser: (parent, args) => user.createUser(args),
    deleteUser: (parent, args) => user.deleteUser(args)
  }
}
