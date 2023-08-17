const { HTTP_STATUS_BAD_REQUEST } = require('http2').constants;
const mongoose = require('mongoose');
const cardModel = require('../models/card');

const postCard = (req, res) => {
  const { name, link } = req.body;
  return cardModel.create({ name, link, owner: req.user._id })
    .then((response) => { res.status(201).send(response); })
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Некорректные данные: ${err.name}` });
      }
      return res.status(500).send({ message: `Внутренняя ошибка сервера: ${err.name}` });
    });
};

const getCards = (req, res) => {
  cardModel.find({})
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: `Внутренняя ошибка сервера: ${err.name}` });
    });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  return cardModel.findByIdAndRemove(cardId)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      console.log(err);
      if (err === null) {
        return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный Id карточки' });
      }
      return res.status(500).send({ message: `Внутренняя ошибка сервера: ${err.name}` });
    });
};

const putCardLike = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(500).send({ message: `Внутренняя ошибка сервера: ${err.name}` }));
};

const deleteCardLike = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(500).send({ message: `Внутренняя ошибка сервера: ${err.name}` }));
};

module.exports = {
  postCard,
  getCards,
  deleteCardById,
  putCardLike,
  deleteCardLike,
};
