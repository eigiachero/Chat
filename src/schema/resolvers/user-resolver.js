import * as user from '../../controllers/graphql/user-controller'

export default {
  Query: {
    users: user.getAllUsers,
    user: user.getUserById
  },
  Mutation: {
    createUser: user.createUser,
    deleteUser: user.deleteUser
  }
}
