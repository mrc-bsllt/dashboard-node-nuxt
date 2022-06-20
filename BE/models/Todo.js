const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  done: {
    type: Boolean,
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: { type: Date },
  updated_at: { type: Date }
})

module.exports = mongoose.model('Todo', todoSchema)