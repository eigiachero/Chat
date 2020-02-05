import jwt from 'jsonwebtoken'

export const getAllUsers = (_, args, { models }) => models.user.findAll()

export const getUserById = (_, { id }, { models }) => models.user.findByPk(id)

export const getUserByUsername = (_, username, { models }) => {
  return models.user.findOne({where: username })
}
export const createUser = (_, { input }, { models }) => {
  return models.user.create(input)
}

export const deleteUser = (_, id, { models }) => {
  return models.user.destroy({
    where: id
  })
}

export const signup = async (_, { data }, { models, secret }) => {
  const userSearch = await getUserByUsername(_, { username: data.username }, { models } )
  if(!!userSearch){
    return {
      user: null,
      jwt: null,
      authError: 'User already exists' 
    }
  }
  const newUser = await models.user.create(data)
  const token = jwt.sign({ sub: newUser.id }, String(secret), { expiresIn: '10d' })
  return {
    user: newUser,
    jwt: token,
    authError: null
  }
}