const express = require('express')
const router = express.Router()
const is_auth = require('../middleware/is_auth')

const { update_image, get_user, get_userFriends, get_user_by_username } = require('../controllers/user-controller')

router.put('/user/update-image/:user_id', is_auth, update_image)
router.get('/user/:user_id', is_auth, get_user)
router.get('/user/:user_id/friends', is_auth, get_userFriends)
router.get('/users/:user_username', is_auth, get_user_by_username)

module.exports = router