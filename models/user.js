'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    selfIntro: DataTypes.TEXT,
    avatar: DataTypes.STRING,
    background: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  });
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
};