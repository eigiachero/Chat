import * as user from '../../controllers/graphql/user-controller'

export default {
  Query: {
    users: user.getAllUsers,
    user: user.getUserById,
    currentUser: user.currentUser
  },
  Mutation: {
    signup: user.signup,
    signin: user.signin,
    createUser: user.createUser,
    deleteUser: user.deleteUser
  }
}
