const express = require('express')
const router = express.Router()

const { add_todos, get_todos, delete_todos } = require('../controllers/todos-controller')
const is_auth = require('../middleware/is_auth')

router.post('/todos', is_auth, add_todos, delete_todos)
router.get('/todos', is_auth, get_todos)

module.exports = router