const express = require("express")
const router = express.Router()
const passport = require('../config/passport')
const api = require('./modules/api')
const upload = require('../middleware/multer')

const userController = require('../controllers/user-controller')

router.use('/api', api)

router.get('/login', userController.loginPage)
router.post('/login', passport.authenticate("local", { failureRedirect: "/login", failureMessage: true }), userController.login)
router.post('/logout', userController.logout)

router.post('/comment/:userId', userController.postComment)

router.get('/register', userController.registerPage)
router.post('/register', userController.register)

router.get('/user/:userId', userController.getHomePage)
router.put('/user/:userId', userController.putUser)



module.exports = router