const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const User = require('../models/User')
const bcrypt = require('bcrypt')

const { create_user, login } = require('../controllers/auth-controller')

router.post('/signup', [
  check('username', 'Username must be min 5 characters long')
    .isLength({ min: 5 })
    .trim(),
  check('email', 'Invalid Email!')
    .isEmail().bail()
    .custom(async (email) => {
      const user = await User.findOne({ email })

      if(user) {
        return Promise.reject('User already exist!')
      } else {
        return true
      }
    }),
  check('password', 'Invalid Password! Must contain at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol')
    .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
  check('confirm_password')
    .custom((password, { req }) => {
      if(password !== req.body.password) {
        return Promise.reject('Passwords must be match!')
      } else {
        return true
      }
    }) 
], create_user)

router.post('/login', [
  check('email', 'Invalid Email!')
    .isEmail().bail()
    .custom(async (email) => {
      const user = await User.findOne({ email })

      if(!user) {
        return Promise.reject('User does not exist!')
      } else {
        return true
      }
    }),
  check('password', 'Invalid password!')
    .custom(async (password, { req }) => {
      const user = await User.findOne({ email: req.body.email })
      if(!user) {
        return Promise.reject()
      }
      
      const is_valid = await bcrypt.compare(password, user.password)
      if(!is_valid) {
        return Promise.reject()
      } else {
        return true
      }
    }) 
], login)
module.exports = router