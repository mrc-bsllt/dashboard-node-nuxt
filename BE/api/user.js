const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const User = require('../models/User')

const { update_image } = require('../controllers/user-controller')

router.put('/user/update-image/:user_id', update_image)

module.exports = router