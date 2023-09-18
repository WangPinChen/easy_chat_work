const express = require("express")
const router = express.Router()
const passport = require('../config/passport')

const userController = require('../controllers/user-controller')

router.get('/login', userController.loginPage)
router.post('/login', passport.authenticate("local", { failureRedirect: "/login", failureMessage: true }), userController.login)
router.get('/register', userController.registerPage)
router.post('/register', userController.register)
router.get('/', (req, res) => res.render('home'))

module.exports = router