const express = require('express')
const router = express.Router()
const apiController = require('../../controllers/api-controller')

router.get('/user/:userId/comment', apiController.getComment)
router.get('/user/:userId', apiController.getUser)
router.get('/user', apiController.getCurrentUser)

router.post('/message/read', apiController.readMsg)

router.get('/explore', apiController.getExploreUser)

module.exports = router