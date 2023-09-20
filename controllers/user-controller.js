const bcrypt = require("bcryptjs")
const multer = require('multer')
const upload = multer({ dest: 'temp/' }).fields([{ name: 'avatar', maxCount: 1 }, { name: 'background', maxCount: 1 }])
const { User, Comment } = require('../models')
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
      return res.render(name, account, password, passwordCheck, errors)
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
      console.log(req.files)
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
  }

}

module.exports = userController