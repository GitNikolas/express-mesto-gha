const router = require('express').Router();

const {
  postCard,
  getCards,
  deleteCardById,
  putCardLike,
  deleteCardLike,
} = require('../controllers/cards');

router.post('/', postCard);

router.get('/', getCards);

router.delete('/:cardId', deleteCardById);

router.put('/:cardId/likes', putCardLike);

router.delete('/:cardId/likes', deleteCardLike);

module.exports = router;
