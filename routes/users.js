const router = require('express').Router();

const {
  getUsers,
  getUserById,
  postUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.post('/users', postUser);

router.get('/users', getUsers);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateAvatar);

router.get('/users/:userId', getUserById);

module.exports = router;
