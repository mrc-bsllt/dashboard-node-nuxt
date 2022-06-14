const User = require('../models/User')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')

const create_user = async (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() })
  }

  try {
    const { username, email, password } = req.body
    const created_at = new Date()
    const updated_at = new Date()

    const hashed_password = await bcrypt.hash(password, 12)

    const user = new User({ username, email, password: hashed_password, created_at, updated_at })
    await user.save()
  
    res.status(201).json({ message: 'User created', user })
  } catch(error) {
    res.satus(500).send({ message: 'Server error!' })
  }
}

module.exports = { create_user }