import jwt from 'jsonwebtoken'

export const getAllUsers = (_, args, { models }) => models.user.findAll()

export const getUserById = (_, { id }, { models }) => models.user.findByPk(id)

export const createUser = (_, { input }, { models }) => {
  return models.user.create(input)
}

export const deleteUser = (_, id, { models }) => {
  return models.user.destroy({
    where: id
  })
}

export const currentUser = (_, id, { user }) => user

export const signup = async (_, { data: user }, { models, secret }) => {
  const newUser = await models.user.create(user)
  const token = jwt.sign({ sub: newUser.id }, secret, { expiresIn: '10d' })

  return {
    user: newUser,
    jwt: token
  }
}

export const signin = async (_, { data: userData }, { models, secret }) => {
  const user = await models.user.signin(userData)
  const token = jwt.sign({ sub: user.id }, secret, { expiresIn: '10d' })

  return {
    user: user,
    jwt: token
  }
}
