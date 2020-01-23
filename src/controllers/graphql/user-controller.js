import db from '../../models'

export const createUser = ({ input: data }) => {
  return db.user.create({
    firstName: data.firstName,
    lastName: data.lastName,
    username: data.username,
    password: data.password
  })
}

export const deleteUser = (args) => {
  return db.user.destroy({
    where: {
      id: args.id
    }
  })
}
