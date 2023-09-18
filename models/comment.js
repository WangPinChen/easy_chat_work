'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    comment: DataTypes.TEXT,
    commenterId: DataTypes.INTEGER,
    recipientId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'Comments',
    underscored: true
  });
  Comment.associate = function (models) {
    // associations can be defined here
  };
  return Comment;
};