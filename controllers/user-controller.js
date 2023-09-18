const userController = {
  loginPage: (req, res) => {
    res.render('login')
  },
  registerPage: (req, res) => {
    res.render('register')
  }
}

module.exports = userController