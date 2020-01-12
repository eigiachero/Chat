import crypto from 'crypto'
'use strict';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: { type: DataTypes.STRING, allowNull: false, unique:true },
    salt: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }
  }, {});

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

  User.getRandomSalt = function (bytes = 16) {
    return crypto.randomBytes(bytes).toString('hex')
  }

  User.encryptPassword = function (plainPassword, salt) {
    return crypto.scryptSync(plainPassword, salt, 64).toString('hex')
  }

  // hooks
  User.beforeCreate(User.hashPasswordHook.bind(User))
  User.beforeUpdate(User.hashPasswordHook.bind(User))

  return User;
};