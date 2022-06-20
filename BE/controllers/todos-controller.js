const User = require('../models/User')
const Todo = require('../models/Todo')

const add_todo = async (req, res, next) => {
  const user_id = req.user_id
  const { content } = req.body
  const done = false
  const created_at = new Date()
  const updated_at = new Date()
  const user = await User.findById(user_id)

  const todo = new Todo({ content, done, user_id, created_at, updated_at })
  user.todos.push(todo._id)

  await Promise.all([todo.save(), user.save()])
  
  res.status(201).json({ message: 'Todo created' })
}

const get_todos = async (req, res, next) => {
  const user_id = req.user_id
  const { todos } = await User.findById(user_id).populate('todos')
  
  res.status(200).json(todos)
}

module.exports = { add_todo, get_todos }