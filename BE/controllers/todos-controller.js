const User = require('../models/User')
const Todo = require('../models/Todo')
let responses = []

const get_todos = async (req, res, next) => {
  const user_id = req.user_id
  const { todos } = await User.findById(user_id).populate('todos')
  
  res.status(200).json(todos)
}

const add_todos = async (req, res, next) => {
  responses = []
  const user_id = req.user_id
  const { added_todos } = req.body
  
  if(added_todos.length) {
    const user = await User.findById(user_id)
    await Promise.all(added_todos.map(async todo => {
      const { content, done } = todo
      const newTodo = new Todo({ content, done, user_id, created_at: new Date(), updated_at: new Date() })
      user.todos.push(newTodo._id)
      await newTodo.save()
    }))
    await user.save()
    
    responses.push({ message: 'Todos created' })
  } else {
    responses.push({ message: 'Nothing to add' })
  }

  next()
}

const delete_todos = async (req, res, next) => {
  const user_id = req.user_id
  const { deleted_todos } = req.body
  const ids = deleted_todos.map(todo => todo._id)
  
  if(deleted_todos.length) {
    const user = await User.findById(user_id)
    user.todos = user.todos.filter(todo_id => !ids.includes(todo_id.toString()))
    
    await Promise.all([user.save(), Todo.deleteMany({ _id: { $in: ids }})])
  } else {
    responses.push({ message: 'Nothing to delete' })
  }

  res.status(201).json(responses)
}

module.exports = { add_todos, get_todos, delete_todos }