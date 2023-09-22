'use strict';
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Comment, { foreignKey: 'recipientId' })
    }
  }

  User.init({
    name: DataTypes.STRING,
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    selfIntro: DataTypes.TEXT,
    avatar: DataTypes.STRING,
    background: DataTypes.STRING,
    isJoinPublicRoom: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User;
};