const bcrypt = require("bcryptjs")
const { User } = require('../models')

const userController = {
  loginPage: (req, res) => {
    res.render('login')
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
  }

}

module.exports = userController