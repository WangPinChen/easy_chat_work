const express = require("express")
const router = express.Router()
const passport = require('../config/passport')
const api = require('./modules/api')

const userController = require('../controllers/user-controller')

router.use('/api', api)

router.put('/user/:userId', userController.putUser)
router.get('/user/:userId', userController.getHomePage)

router.post('/comment/:userId', userController.postComment)

router.get('/login', userController.loginPage)
router.post('/login', passport.authenticate("local", { failureRedirect: "/login", failureMessage: true }), userController.login)
router.post('/logout', userController.logout)

router.get('/register', userController.registerPage)
router.post('/register', userController.register)

router.get('/explore', userController.getExplorePage)

router.get('/message', userController.getPublicMessage)

router.get('/', (req, res) => {
  res.redirect(`/user/${req.user.id}`)
})

module.exports = router