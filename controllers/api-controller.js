const { User, Comment } = require('../models')
const { Sequelize } = require('sequelize')

const apiController = {
  getCurrentUser: async (req, res) => {
    const user = req.user
    delete user.password
    res.json({ status: 'success', user })
  },
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
    const page = req.query.page || 1
    const limit = 16
    const currentUserId = req.user.id
    const users = await User.findAll({
      where: {
        id: {
          [Sequelize.Op.ne]: currentUserId
        }
      },
      offset: (page - 1) * limit,
      limit,
    })
    res.json({ status: 'success', users })
  }
}

module.exports = apiController