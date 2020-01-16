import db from '../../models'

export function createUser (args) {
  const data = args.input
  return db.user.create({
    firstName: data.firstName,
    lastName: data.lastName,
    username: data.username,
    password: data.password
  })
}

export function deleteUser (args) {
  return db.user.destroy({
    where: {
      id: args.id
    }
  })
}
