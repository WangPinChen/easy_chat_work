'use strict';
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class PrivateMsg extends Model {
    static associate(models) {
      PrivateMsg.belongsTo(models.User, {
        foreignKey: 'senderId',
        as: 'sender'
      })
    }
  }

  PrivateMsg.init({
    senderId: DataTypes.INTEGER,
    recipientId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    isRead: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'PrivateMsg',
    tableName: 'Private_messages',
    underscored: true,
  })
  return PrivateMsg;
};