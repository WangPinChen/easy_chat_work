const { User, Comment } = require('../models')
const { Sequelize } = require('sequelize')

const apiController = {
  getComment: async (req, res) => {
    const user = await User.findOne({
      where: { id: req.params.userId },
      include: [Comment]
    })
    const comments = await Comment.findAll({
      where: { recipientId: req.params.userId },
      include: [User]
    })
    res.json({ status: 'success', comments })
  },
  getExploreUser: async (req, res) => {
    const currentUserId = req.user.id
    console.log(req.user.id)
    const users = await User.findAll({
      where: {
        id: {
          [Sequelize.Op.ne]: currentUserId
        }
      }
    })
    res.json({ status: 'success', users })
  }
}

module.exports = apiController