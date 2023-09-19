const express = require("express")
const router = express.Router()
const passport = require('../config/passport')

const api = require('./modules/api')

const userController = require('../controllers/user-controller')


router.use('/api', api)
router.get('/login', userController.loginPage)
router.post('/login', passport.authenticate("local", { failureRedirect: "/login", failureMessage: true }), userController.login)
router.get('/register', userController.registerPage)
router.post('/register', userController.register)
router.get('/:userId', userController.getHomePage)
router.get('/', (req, res) => res.redirect('/login'))


module.exports = router