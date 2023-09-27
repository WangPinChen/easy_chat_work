const { User, Comment, PrivateMsg } = require('../models')
const { Sequelize } = require('sequelize')

const apiController = {
  getCurrentUser: async (req, res) => {
    const user = req.user
    delete user.password
    res.json({ status: 'success', user })
  },
  getUser: async (req, res) => {
    const user = await User.findOne({
      where: { id: req.params.userId },
      attributes: { exclude: ['password'] }
    })
    res.json({ status: 'success', user })
  },
  getComment: async (req, res) => {
    const user = await User.findOne({
      where: { id: req.params.userId },
      include: [Comment],
      attributes: { exclude: ['password'] }
    })
    const comments = await Comment.findAll({
      where: { recipientId: req.params.userId },
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] }
        }
      ]
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
      attributes: { exclude: ['password'] }
    })
    res.json({ status: 'success', users })
  },
  readMsg: async (req, res) => {
    const messageIds = req.body.messageIds;
    for (const messageId of messageIds) {
      await PrivateMsg.update(
        { isRead: true },
        { where: { id: messageId } }
      )
    }

  },
  checkUnreadMsg: async (req, res) => {
    const message = await PrivateMsg.findOne({
      where: {
        recipientId: req.params.userId,
        isRead: false
      }
    })
    if (message) {
      res.json({ status: 'success', isRead: false })
    } else if (!message) {
      res.json({ status: 'success', isRead: true })
    }
  }
}

module.exports = apiController