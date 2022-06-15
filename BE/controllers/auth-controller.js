const User = require('../models/User')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jsonToken = require('jsonwebtoken')

const create_user = async (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  try {
    const { username, email, password } = req.body
    const created_at = new Date()
    const updated_at = new Date()

    const hashed_password = await bcrypt.hash(password, 12)

    const user = new User({ username, email, password: hashed_password, image_path: null, created_at, updated_at })
    await user.save()
  
    res.status(201).json({ message: 'User created', user })
  } catch(error) {
    res.satus(500).send({ message: 'Server error!' })
  }
}

const login = async (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const { email } = req.body
  try {
    const user = await User.findOne({ email })
    const user_id = user._id.toString()
  
    const token = jsonToken.sign({ user_id, email }, 'supersecretstring', { expiresIn: '4h' })
    req.user = user
    
    res.status(200).json({ token, user_id, message: 'Successfully Authenticated!' })
  } catch(error) {
    res.status(500).json({ message: 'Server error!' })
  }
}

module.exports = { create_user, login }