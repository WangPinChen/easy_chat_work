const bcrypt = require("bcryptjs")
const multer = require('multer')
const upload = multer({ dest: 'temp/' }).fields([{ name: 'avatar', maxCount: 1 }, { name: 'background', maxCount: 1 }])
const { User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  loginPage: (req, res) => {
    res.render('login')
  },
  login: (req, res) => {
    req.flash('success_msg', '登入成功。')
    res.redirect(`/${req.user.id}`)
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
    const user = req.user
    res.render('home', { user })
  },
  putUser: (req, res) => {
    upload(req, res, async () => {
      console.log(req.files)
      let backgroundPath = ''
      let avatarPath = ''
      if (Object.keys(req.files).length !== 0) {
        const backgroundFile = req.files.background[0]
        const avatarFile = req.files.avatar[0]
        console.log(backgroundFile, avatarFile)
        backgroundPath = await imgurFileHandler(backgroundFile)
        avatarPath = await imgurFileHandler(avatarFile)
      }

      console.log(backgroundPath, avatarPath)

      const user = await User.findOne({ where: { id: req.user.id } })
      await user.update({
        name: req.body.name,
        selfIntro: req.body.selfIntro,
        avatar: avatarPath || user.avatar,
        background: backgroundPath || user.background
      })

      return res.redirect('back')
    })
  }

}

module.exports = userController