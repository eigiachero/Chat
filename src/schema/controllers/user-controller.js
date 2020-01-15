import db from '../../models'

export default {
  createUser: function createUser (args) {
    return db.user.create({
      firstName: args.firstName,
      lastName: args.lastName,
      username: args.username,
      password: args.password
    })
  },
  deleteUser: function deleteUser (args) {
    return db.user.destroy({
      where: {
        id: args.id
      }
    })
  }
}
