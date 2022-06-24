const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  image_path: { 
    type: String, 
    required: false 
  },
  todos: [{
    type: Schema.Types.ObjectId,
    ref: 'Todo',
    default: []
  }],
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  requests_sent: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  requests_received: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  created_at: { type: Date },
  updated_at: { type: Date }
})

module.exports = mongoose.model('User', userSchema)