const {
  HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED,
  HTTP_STATUS_OK, HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_NOT_FOUND,
} = require('http2').constants;
const mongoose = require('mongoose');
const userModel = require('../models/user');

const getUsers = (req, res) => {
  userModel.find({})
    .then((response) => {
      res.status(HTTP_STATUS_OK).send(response);
    })
    .catch((err) => {
      console.log(err.name);
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Внутренняя ошибка сервера: ${err.name}` });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  return userModel.findById(userId)
    .orFail()
    .then((response) => res.status(HTTP_STATUS_OK).send(response))
    .catch((err) => {
      console.log(err.name);
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: `Пользователь с указанным id не найден: ${userId}` });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Внутренняя ошибка сервера: ${err.name}` });
    });
};

const postUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return userModel.create({ name, about, avatar })
    .then((response) => { res.status(HTTP_STATUS_CREATED).send(response); })
    .catch((err) => {
      console.log(err.name);
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Некорректные данные: ${err.name}` });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Внутренняя ошибка сервера: ${err.name}` });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  return userModel.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: true },
  )
    .then((response) => res.status(HTTP_STATUS_OK).send(response))
    .catch((err) => {
      console.log(err.name);
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Некорректные данные: ${err.name}` });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Внутренняя ошибка сервера: ${err.name}` });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  return userModel.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: true },
  )
    .then((response) => { res.status(HTTP_STATUS_OK).send(response); })
    .catch((err) => {
      console.log(err.name);
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Некорректные данные: ${err.name}` });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Внутренняя ошибка сервера: ${err.name}` });
    });
};

module.exports = {
  getUsers,
  getUserById,
  postUser,
  updateUser,
  updateAvatar,
};
