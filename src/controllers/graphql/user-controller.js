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

export const signup = async (_, { data: user }, { models, secret }) => {
  const newUser = await models.user.create(user)
  const token = jwt.sign({ sub: newUser.id }, secret, { expiresIn: '10d' })

  return {
    user: newUser,
    jwt: token
  }
}

const getValidatedUserFrom = async (models, userData) => {
  const validUser = await models.user.findByUsername(userData.username)

  if (!validUser) {
    throw Error('User not found')
  }

  if (!validUser.passwordMatches(userData.password)) {
    throw Error('User not found')
  }

  return validUser
}

export const signin = (_, { data: userData }, { models, secret }) => {
  const user = getValidatedUserFrom(models, userData)
  const token = jwt.sign({ sub: user.id }, secret, { expiresIn: '10d' })

  return {
    user: user,
    jwt: token
  }
}
