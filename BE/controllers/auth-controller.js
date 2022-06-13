const User = require('../models/User')
const { validationResult } = require('express-validator')

const create_user = async (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() })
  }

  const { username, email, password } = req.body
  const created_at = new Date()
  const updated_at = new Date()

  const user = new User({ username, email, password, created_at, updated_at })
  await user.save()

  res.status(201).json({ message: 'User created', user })
}

module.exports = { create_user }