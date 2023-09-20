const express = require('express')
const router = express.Router()
const apiController = require('../../controllers/api-controller')

router.get('/user/:userId/comment', apiController.getComment)
router.get('/explore', apiController.getExploreUser)

module.exports = router