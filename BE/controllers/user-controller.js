const User = require('../models/User')
const deleteImage = require('../utils/delete-image')
const io = require('../socket')

const update_image = async (req, res, next) => {
  const user_id = req.params.user_id
  const image_path = '/' + req.file.path
  const user = await User.findById(user_id)
  
  if(user.image_path) {
    deleteImage(user.image_path)
  }

  user.image_path = image_path
  user.updated_at = new Date()
  await user.save()
  res.status(201).json({ message: 'User updated!' })
}

const get_user = async (req, res, next) => {
  const user_id = req.params.user_id
  const user = await User.findById(user_id).populate('requests_received')

  res.status(200).json(user)
}

const get_userCommunity = async (req, res, next) => {
  const user_id = req.params.user_id
  const { friends, requests_sent, requests_received } = await User.findById(user_id)
                                .populate('friends')
                                .populate('requests_sent')
                                .populate('requests_received')
  
  res.status(200).json({ friends, requests_sent, requests_received })
}

const get_user_by_username = async (req, res, next) => {
  const { user_username } = req.params
  const regex = new RegExp("^" + user_username)
  
  const users = ( await User.find({ username: regex }) ).filter(user => user._id.toString() !== req.user_id)
  res.status(200).json(users)
}

const send_friend_request = async (req, res, next) => {
  const user_id = req.user_id
  const { friend_id } = req.params
  const [ user, friend ] = await Promise.all([User.findById(user_id), User.findById(friend_id)])
  user.requests_sent.push(friend_id)
  friend.requests_received.push(user_id)
  
  await Promise.all([user.save(), friend.save()])
  io.getIO().emit('requests', { action: 'send', user, friend_id })

  res.status(201).json({ message: "request sent!" })
}

const reject_friendship = async (req, res, next) => {
  const user_id = req.user_id
  const { friend_id } = req.body
  const [ user, friend ] = await Promise.all([User.findById(user_id), User.findById(friend_id)])

  user.requests_received = user.requests_received.filter(id => id.toString() !== friend_id)
  friend.requests_sent = friend.requests_sent.filter(id => id.toString() !== user_id)

  await Promise.all([user.save(), friend.save()])

  res.status(201).json({ message: 'Reject friendship' })
}

const accept_friendship = async (req, res, next) => {
  const user_id = req.user_id
  const { friend_id } = req.body
  const [ user, friend ] = await Promise.all([User.findById(user_id), User.findById(friend_id)])

  user.requests_received = user.requests_received.filter(id => id.toString() !== friend_id)
  user.friends.push(friend_id)
  friend.requests_sent = friend.requests_sent.filter(id => id.toString() !== user_id)
  friend.friends.push(user_id)

  await Promise.all([user.save(), friend.save()])

  res.status(201).json({ message: 'Add friendship' })
}

module.exports = { update_image, get_user, get_userCommunity, get_user_by_username, send_friend_request, reject_friendship, accept_friendship }