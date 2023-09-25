const express = require("express")
const router = express.Router()
const passport = require('../config/passport')
const api = require('./modules/api')
const authenticated = require('../middleware/auth')

const userController = require('../controllers/user-controller')

router.use('/api', api)

router.put('/user/:userId', authenticated, userController.putUser)
router.get('/user/:userId', authenticated, userController.getHomePage)

router.post('/comment/:userId', authenticated, userController.postComment)

router.get('/login', userController.loginPage)
router.post('/login', passport.authenticate("local", { failureRedirect: "/login", failureMessage: true }), userController.login)
router.post('/logout', userController.logout)

router.get('/register', userController.registerPage)
router.post('/register', userController.register)

router.get('/explore', authenticated, userController.getExplorePage)

router.get('/message/private/:userId', authenticated, userController.getPrivateMessage)
router.get('/message/private', authenticated, userController.getPrivateMessageHome)
router.get('/message', authenticated, userController.getPublicMessage)

router.get('/', authenticated, (req, res) => {
  res.redirect(`/user/${req.user.id}`)
})

module.exports = router