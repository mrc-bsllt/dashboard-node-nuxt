const express = require('express')
const router = express.Router()

const { create_user } = require('../controllers/auth-controller')

router.post('/signup', create_user)

module.exports = router