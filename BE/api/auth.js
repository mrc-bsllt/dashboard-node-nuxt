const express = require('express')
const router = express.Router()
const { check } = require('express-validator')

const { create_user } = require('../controllers/auth-controller')

router.post('/signup', [
  check('username', 'Username must be min 5 characters long')
    .isLength({ min: 5 })
    .trim()
], create_user)

module.exports = router