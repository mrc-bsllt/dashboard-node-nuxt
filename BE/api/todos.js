const express = require('express')
const router = express.Router()

const { add_todo, get_todos } = require('../controllers/todos-controller')
const is_auth = require('../middleware/is_auth')

router.post('/todo', is_auth, add_todo)
router.get('/todos', is_auth, get_todos)

module.exports = router