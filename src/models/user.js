import crypto from 'crypto'

export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true
  })

  // Instance methods
  User.prototype.passwordMatches = function (value) {
    return User.encryptPassword(value, this.salt) === this.password
  }

  // Class methods
  User.hashPasswordHook = async function (user) {
    if (!user.password || !user.changed('password')) return user

    user.salt = this.getRandomSalt()
    user.password = await User.encryptPassword(user.password, user.salt)
  }

  User.hashValidateHook = function (user) {
    if (!user.salt) user.salt = this.getRandomSalt()
  }

  User.getRandomSalt = function (bytes = 16) {
    return crypto.randomBytes(bytes).toString('hex')
  }

  User.encryptPassword = function (plainPassword, salt) {
    return crypto.scryptSync(plainPassword, salt, 64).toString('hex')
  }

  User.findByUsername = (username) => User.findOne({ where: { username } })

  User.signin = async (user) => {
    const validUser = await User.findByUsername(user.username)

    if (!validUser) {
      throw Error('User not found')
    }

    if (!validUser.passwordMatches(user.password)) {
      throw Error('User not found')
    }

    return validUser
  }

  // hooks
  User.beforeValidate(User.hashValidateHook.bind(User))
  User.beforeCreate(User.hashPasswordHook.bind(User))
  User.beforeUpdate(User.hashPasswordHook.bind(User))

  return User
}
