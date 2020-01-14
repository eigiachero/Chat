export default {
  Query: {
    users: (parent, args, { db }, info) => db.user.findAll(),
    user: (parent, { id }, { db }, info) => db.user.findByPk(id)
  },
  Mutation: {
    createUser: (parent, { firstName, lastName, username, password }, { db }, info) => {
      return db.user.create({
        firstName: firstName,
        lastName: lastName,
        username: username,
        salt: '',
        password: password
      })
    }
  }
}
