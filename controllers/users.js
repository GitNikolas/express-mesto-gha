const { HTTP_STATUS_BAD_REQUEST } = require('http2').constants;
const mongoose = require('mongoose');
const userModel = require('../models/user');

const getUsers = (req, res) => {
  userModel.find({})
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: `Внутренняя ошибка сервера: ${err.name}` });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  return userModel.findById(userId)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      console.log(err);
      if (err === null) {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный Id пользователя' });
      }
      return res.status(500).send({ message: `Внутренняя ошибка сервера: ${err.name}` });
    });
};

const postUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return userModel.create({ name, about, avatar })
    .then((response) => { res.status(201).send(response); })
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Некорректные данные: ${err.name}` });
      }
      return res.status(500).send({ message: `Внутренняя ошибка сервера: ${err.name}` });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  return userModel.findByIdAndUpdate(req.user._id, { name, about })
    .then((response) => { res.status(200).send(response); })
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Некорректные данные: ${err.name}` });
      }
      return res.status(500).send({ message: `Внутренняя ошибка сервера: ${err.name}` });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  return userModel.findByIdAndUpdate(req.user._id, { avatar })
    .then((response) => { res.status(200).send(response); })
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Некорректные данные: ${err.name}` });
      }
      return res.status(500).send({ message: `Внутренняя ошибка сервера: ${err.name}` });
    });
};

module.exports = {
  getUsers,
  getUserById,
  postUser,
  updateUser,
  updateAvatar,
};
