const router = require('express').Router();

const {
  postCard,
  getCards,
  deleteCardById,
  putCardLike,
  deleteCardLike,
} = require('../controllers/cards');

router.post('/cards', postCard);

router.get('/cards', getCards);

router.delete('/cards/:cardId', deleteCardById);

router.put('/cards/:cardId/likes', putCardLike);

router.delete('/cards/:cardId/likes', deleteCardLike);

module.exports = router;
