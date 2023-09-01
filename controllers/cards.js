const {
  HTTP_STATUS_CREATED, HTTP_STATUS_OK,
} = require('http2').constants;
const mongoose = require('mongoose');
const cardModel = require('../models/card');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

const postCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  return cardModel.create({ name, link, owner: _id })
    .then((response) => { res.status(HTTP_STATUS_CREATED).send(response); })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(`Некорректные данные: ${err.name}`));
      }
      return next(err);
    });
};

const getCards = (req, res, next) => {
  cardModel.find({})
    .then((response) => {
      res.status(HTTP_STATUS_OK).send(response);
    })
    .catch(next);
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  return cardModel.findById(cardId)
    .orFail()
    .then((card) => {
      const ownerId = card.owner.toString();
      if (ownerId !== _id) {
        throw new ForbiddenError('У вас недостаточно прав');
      }
      return card.deleteOne();
    })
    .then((cardData) => res.status(HTTP_STATUS_OK).send(cardData))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError(`Некорректный id: ${cardId}`));
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(`Карточка с указанным id не найдена: ${cardId}`));
      }
      return next(err);
    });
};

const putCardLike = (req, res, next) => {
  const { cardId } = req.params;
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((response) => res.status(HTTP_STATUS_OK).send(response))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError(`Некорректный id: ${cardId}`));
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(`Карточка с указанным id не найдена: ${cardId}`));
      }
      return next(err);
    });
};

const deleteCardLike = (req, res, next) => {
  const { cardId } = req.params;
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((response) => res.status(HTTP_STATUS_OK).send(response))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError(`Некорректный id: ${cardId}`));
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(`Карточка с указанным id не найдена: ${cardId}`));
      }
      return next(err);
    });
};

module.exports = {
  postCard,
  getCards,
  deleteCardById,
  putCardLike,
  deleteCardLike,
};
