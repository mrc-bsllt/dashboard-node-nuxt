const User = require('../models/User')
const deleteImage = require('../utils/delete-image')

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
  const user = await User.findById(user_id)

  res.status(200).json(user)
}

const get_userFriends = async (req, res, next) => {
  const user_id = req.params.user_id
  const { friends } = await User.findById(user_id).populate('friends')
  
  res.status(200).json(friends)
}

const get_user_by_username = async (req, res, next) => {
  const { user_username } = req.params
  const regex = new RegExp("^" + user_username)
  
  const users = ( await User.find({ username: regex }) ).filter(user => user._id.toString() !== req.user_id)
  res.status(200).json(users)
}

module.exports = { update_image, get_user, get_userFriends, get_user_by_username }