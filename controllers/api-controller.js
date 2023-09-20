const { User, Comment } = require('../models')

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
  }
}

module.exports = apiController