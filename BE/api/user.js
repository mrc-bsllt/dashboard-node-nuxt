const express = require('express')
const router = express.Router()
const is_auth = require('../middleware/is_auth')

const { 
  update_image, 
  get_user, 
  get_userCommunity, 
  get_user_by_username, 
  send_friend_request,
  reject_friendship,
  accept_friendship
} = require('../controllers/user-controller')

router.put('/user/update-image/:user_id', is_auth, update_image)
router.get('/user/:user_id', is_auth, get_user)
router.get('/user/:user_id/community', is_auth, get_userCommunity)
router.get('/users/:user_username', is_auth, get_user_by_username)
router.put('/user/send-request/:friend_id', is_auth, send_friend_request)
router.post('/user/reject-friendship', is_auth, reject_friendship)
router.post('/user/accept-friendship', is_auth, accept_friendship)

module.exports = router