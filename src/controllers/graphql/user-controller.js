import db from '../../models'

export const createUser = ({ input }) => {
  return db.user.create(input)
}

export const deleteUser = (args) => {
  return db.user.destroy({
    where: args
  })
}
