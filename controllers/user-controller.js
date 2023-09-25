const bcrypt = require("bcryptjs")
const multer = require('multer')
const upload = multer({ dest: 'temp/' }).fields([{ name: 'avatar', maxCount: 1 }, { name: 'background', maxCount: 1 }])
const { User, Comment, PrivateMsg, sequelize } = require('../models')
const { Op } = require('sequelize')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  loginPage: (req, res) => {
    res.render('login')
  },
  login: (req, res) => {
    req.flash('success_msg', '登入成功。')
    res.redirect(`/user/${req.user.id}`)
  },
  logout: (req, res) => {
    req.logout()
    req.flash('success_msg', '登出成功。')
    res.redirect('/login')
  },
  registerPage: (req, res) => {
    res.render('register')
  },
  register: async (req, res) => {
    const { name, account, password, passwordCheck } = req.body
    const errors = {}
    if (name.length > 50 || name.length < 1) {
      errors.isNameError = true
    }
    if (!/^(?=.*[a-z])(?=.*\d)[a-z\d]{6,20}$/.test(account)) {
      errors.isAccountError = true
    }
    if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/.test(password)) {
      errors.isPasswordError = true
    }
    if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/.test(passwordCheck)) {
      errors.isPasswordCheckError = true
    }
    if (password !== passwordCheck) {
      errors.isPasswordError = true
      errors.isPasswordCheckError = true
      errors.passwordCheckMsg = '密碼與確認密碼不相符'
    }
    if (Object.keys(errors).length !== 0) {
      console.log(errors)
      return res.render('register', { name, account, password, passwordCheck, errors })
    }

    const user = await User.findOne({ where: { account } })
    if (user) {
      errors.isAccountError = true
      errors.accountMsg = '此帳號已被註冊'
      return res.render('register', { name, account, password, passwordCheck, errors })
    }

    const hash = await bcrypt.hash(password, 10)
    await User.create({
      name,
      account,
      password: hash
    })
    return res.redirect('/login')
  },
  getHomePage: async (req, res) => {
    const user = await User.findOne({
      where: { id: req.params.userId },
      raw: true
    })
    if (user === null) {
      req.flash('warning_msg', '使用者不存在')
      return res.redirect('/')
    }
    if (user.id === req.user.id) {
      user.isUserSelf = true
    }
    res.render('home', { user })
  },
  putUser: (req, res) => {
    upload(req, res, async () => {
      let backgroundPath = ''
      let avatarPath = ''

      if (Object.keys(req.files).length !== 0) {
        if (req.files.background) {
          backgroundPath = await imgurFileHandler(req.files.background[0])
        }
        if (req.files.avatar) {
          avatarPath = await imgurFileHandler(req.files.avatar[0])
        }
      }

      const user = await User.findOne({ where: { id: req.user.id } })
      await user.update({
        name: req.body.name,
        selfIntro: req.body.selfIntro,
        avatar: avatarPath || user.avatar,
        background: backgroundPath || user.background
      })

      return res.redirect('back')
    })
  },
  postComment: async (req, res) => {
    const commenterId = req.user.id
    const recipientId = req.params.userId
    if (commenterId === recipientId) {
      req.flash('warning_msg', '不可對自己留言')
      req.redirect('back')
    }
    const commenter = await User.findOne({ where: { id: commenterId } })
    const recipient = await User.findOne({ where: { id: recipientId } })
    if (!commenter) {
      req.flash('warning_msg', '留言者不存在')
      req.redirect('back')
    }
    if (!recipient) {
      req.flash('warning_msg', '留言對象不存在')
      req.redirect('back')
    }

    await Comment.create({
      comment: req.body.comment,
      commenterId,
      recipientId
    })
    req.flash('success_msg', '留言成功')
    res.redirect('back')
  },
  getExplorePage: async (req, res) => {
    res.render('explore')
  },
  getPublicMessage: async (req, res) => {
    const onlineUsers = await User.findAll({
      where: { isJoinPublicRoom: true },
      raw: true
    })
    res.render('message', { onlineUsers })
  },
  getPrivateMessageHome: async (req, res) => {
    sequelize.query(
      `
        SELECT pm.*,
        senders.id as senderId,
        senders.avatar as senderAvatar,
        senders.name as senderName,
        senders.account as senderAccount,
        recipients.id as recipientId,
        recipients.avatar as recipientAvatar,
        recipients.name as recipientName,
        recipients.account as recipientAccount,
        COUNT(CASE WHEN pm.is_read = 0 THEN 1 ELSE NULL END) AS unreadCount,
        MAX(pm.created_at) AS max_created_at
        FROM private_messages AS pm
        INNER JOIN users AS senders ON pm.sender_id = senders.id
        INNER JOIN users AS recipients ON pm.recipient_id = recipients.id
        WHERE pm.sender_id = ${req.user.id} OR pm.recipient_id = ${req.user.id}
        GROUP BY pm.sender_id, pm.recipient_id
        ORDER BY max_created_at DESC;
      `
      , { type: sequelize.QueryTypes.SELECT }
    ).then(users => {
      const data = users.map(user => {

        if (user.sender_id === req.user.id) {
          return {
            userId: user.recipientId,
            userAvatar: user.recipientAvatar,
            userAccount: user.recipientAccount,
            userName: user.recipientName
          }
        } else {
          return {
            userId: user.senderId,
            userAvatar: user.senderAvatar,
            userAccount: user.senderAccount,
            userName: user.senderName,
            unreadCount: user.unreadCount
          }
        }
      })
      const uniqueData = []
      const seenUserIds = {}
      for (const user of data) {
        if (seenUserIds[user.userId]) {
          continue
        }
        seenUserIds[user.userId] = true
        uniqueData.push(user)
      }
      res.render('private-message', { users: uniqueData })
    })
  },
  getPrivateMessage: async (req, res) => {
    Promise.all([
      PrivateMsg.findAll({
        where: {
          // senderId: req.params.userId,
          // recipientId: req.user.id,
          senderId: { [Op.or]: [req.params.userId, req.user.id] },
          recipientId: { [Op.or]: [req.params.userId, req.user.id] },
        },
        include: [{
          model: User,
          as: 'sender'
        }],
        nest: true,
        raw: true
      }),
      sequelize.query(
        `
        SELECT pm.*,
        senders.id as senderId,
        senders.avatar as senderAvatar,
        senders.name as senderName,
        senders.account as senderAccount,
        recipients.id as recipientId,
        recipients.avatar as recipientAvatar,
        recipients.name as recipientName,
        recipients.account as recipientAccount,
        COUNT(CASE WHEN pm.is_read = 0 THEN 1 ELSE NULL END) AS unreadCount,
        MAX(pm.created_at) AS max_created_at
        FROM private_messages AS pm
        INNER JOIN users AS senders ON pm.sender_id = senders.id
        INNER JOIN users AS recipients ON pm.recipient_id = recipients.id
        WHERE pm.sender_id = ${req.user.id} OR pm.recipient_id = ${req.user.id}
        GROUP BY pm.sender_id, pm.recipient_id
        ORDER BY max_created_at DESC;
      `
        , { type: sequelize.QueryTypes.SELECT }
      )
    ])
      .then(([messages, users]) => {

        messages.map(message => {
          if (message.sender.id === req.user.id) {
            message.isUserSelf = true
          }
        })
        //處理user-list
        const data = users.map(user => {

          if (user.sender_id === req.user.id) {
            return {
              userId: user.recipientId,
              userAvatar: user.recipientAvatar,
              userAccount: user.recipientAccount,
              userName: user.recipientName
            }
          } else {
            return {
              userId: user.senderId,
              userAvatar: user.senderAvatar,
              userAccount: user.senderAccount,
              userName: user.senderName,
              unreadCount: user.unreadCount
            }
          }
        })
        const uniqueData = []
        const seenUserIds = {}
        for (const user of data) {
          if (seenUserIds[user.userId]) {
            continue
          }
          seenUserIds[user.userId] = true
          uniqueData.push(user)
        }
        console.log(messages)
        res.render('private-message', { users: uniqueData, messages })
      })
  }
}

module.exports = userController