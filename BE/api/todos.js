const express = require('express')
const router = express.Router()

const { add_todo } = require('../controllers/todos-controller')
const is_auth = require('../middleware/is_auth')

router.post('/todo', is_auth, add_todo)

module.exports = router