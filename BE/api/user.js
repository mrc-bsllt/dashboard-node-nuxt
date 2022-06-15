const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const User = require('../models/User')

const { update_image, get_user } = require('../controllers/user-controller')

router.put('/user/update-image/:user_id', update_image)
router.get('/user/:user_id', get_user)

module.exports = router