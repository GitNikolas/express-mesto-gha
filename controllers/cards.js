const {
  HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED,
  HTTP_STATUS_OK, HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_NOT_FOUND,
} = require('http2').constants;
const mongoose = require('mongoose');
const cardModel = require('../models/card');

const postCard = (req, res) => {
  const { name, link } = req.body;
  return cardModel.create({ name, link, owner: req.user._id })
    .then((response) => { res.status(HTTP_STATUS_CREATED).send(response); })
    .catch((err) => {
      console.log(err.name);
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Некорректные данные: ${err.name}` });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Внутренняя ошибка сервера: ${err.name}` });
    });
};

const getCards = (req, res) => {
  cardModel.find({})
    .then((response) => {
      res.status(HTTP_STATUS_OK).send(response);
    })
    .catch((err) => {
      console.log(err.name);
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Внутренняя ошибка сервера: ${err.name}` });
    });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  return cardModel.findByIdAndRemove(cardId)
    .orFail()
    .then((response) => res.status(HTTP_STATUS_OK).send(response))
    .catch((err) => {
      console.log(err.name);
      if (err instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Некорректный id: ${cardId}` });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: `Карточка с указанным id не найдена: ${cardId}` });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Внутренняя ошибка сервера: ${err.name}` });
    });
};

const putCardLike = (req, res) => {
  const { cardId } = req.params;
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((response) => res.status(HTTP_STATUS_OK).send(response))
    .catch((err) => {
      console.log(mongoose.Error);
      if (err instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Некорректный id: ${cardId}` });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: `Карточка с указанным id не найдена: ${cardId}` });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Внутренняя ошибка сервера: ${err.name}` });
    });
};

const deleteCardLike = (req, res) => {
  const { cardId } = req.params;
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((response) => res.status(HTTP_STATUS_OK).send(response))
    .catch((err) => {
      console.log(mongoose.Error);
      if (err instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Некорректный id: ${cardId}` });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: `Карточка с указанным id не найдена: ${cardId}` });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Внутренняя ошибка сервера: ${err.name}` });
    });
};

module.exports = {
  postCard,
  getCards,
  deleteCardById,
  putCardLike,
  deleteCardLike,
};
