const router = require('express').Router();

const {
  getUsers,
  getUserById,
  postUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.post('/', postUser);

router.get('/', getUsers);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar);

router.get('/:userId', getUserById);

module.exports = router;
