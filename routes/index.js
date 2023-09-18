const express = require("express")
const router = express.Router()

const userController = require('../controllers/user-controller')

router.get('/login', userController.loginPage)
router.get('/register', userController.registerPage)
router.post('/register', userController.register)
router.get('/', (req, res) => res.render('home'))

module.exports = router