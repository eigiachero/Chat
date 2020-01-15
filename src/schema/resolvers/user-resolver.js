import user from '../controllers/user-controller'

export default {
  Query: {
    users: (parent, args, { db }) => db.user.findAll(),
    user: (parent, { id }, { db }) => db.user.findByPk(id)
  },
  Mutation: {
    createUser: (parent, args, { db }) => user.createUser(args),
    deleteUser: (parent, args, { db }) => user.deleteUser(args)
  }
}
