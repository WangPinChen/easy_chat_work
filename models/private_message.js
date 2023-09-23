'use strict';
module.exports = (sequelize, DataTypes) => {
  const Private_message = sequelize.define('Private_message', {
    sender_id: DataTypes.INTEGER,
    recipient_id: DataTypes.INTEGER,
    message: DataTypes.STRING,
    isRead: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'PrivateMsg',
    tableName: 'Private_messages',
    underscored: true,
  });
  Private_message.associate = function (models) {
    // associations can be defined here
  };
  return Private_message;
};