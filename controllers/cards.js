const mongoose = require('mongoose');
const cardModel = require('../models/card');

const postCard = (req, res) => {
  const { name, link } = req.body;
  return cardModel.create({ name, link, owner: req.user._id })
    .then((response) => { res.status(201).send(response); })
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: `Некорректные данные: ${err.name}` });
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
      if (response === null) {
        return res.status(404).send({ message: `Карточка с указанным id не найдена: ${req.params.cardId}` });
      }
      return res.status(200).send(response);
    })
    .catch((err) => {
      console.log(mongoose.Error);
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: `Некорректный id: ${req.params.cardId}` });
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
    .then((response) => {
      if (response === null) {
        return res.status(404).send({ message: `Карточка с указанным id не найдена: ${req.params.cardId}` });
      }
      return res.status(200).send(response);
    })
    .catch((err) => {
      console.log(mongoose.Error);
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: `Некорректный id: ${req.params.cardId}` });
      }
      return res.status(500).send({ message: `Внутренняя ошибка сервера: ${err.name}` });
    });
};

const deleteCardLike = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((response) => {
      if (response === null) {
        return res.status(404).send({ message: `Карточка с указанным id не найдена: ${req.params.cardId}` });
      }
      return res.status(200).send(response);
    })
    .catch((err) => {
      console.log(mongoose.Error);
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: `Некорректный id: ${req.params.cardId}` });
      }
      return res.status(500).send({ message: `Внутренняя ошибка сервера: ${err.name}` });
    });
};

module.exports = {
  postCard,
  getCards,
  deleteCardById,
  putCardLike,
  deleteCardLike,
};
