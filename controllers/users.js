const {
  HTTP_STATUS_CREATED, HTTP_STATUS_OK,
} = require('http2').constants;
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { SALT_ROUNDS = 10 } = process.env;
const { JWT_SECRET = 'testSecretCode' } = process.env;

const mongoose = require('mongoose');
const userModel = require('../models/user');

const ConflictError = require('../errors/conflict-error');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const getUser = (req, res, next) => {
  const { _id } = req.user;

  return userModel.findById(_id)
    .then((response) => {
      res.status(HTTP_STATUS_OK).send(response);
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  userModel.find({})
    .then((response) => {
      res.status(HTTP_STATUS_OK).send(response);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  return userModel.findById(userId)
    .orFail()
    .then((response) => res.status(HTTP_STATUS_OK).send(response))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(`Пользователь с указанным id не найден: ${userId}`));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError(`Некорректный Id: ${userId}`));
      }
      return next(err);
    });
};

const postUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => userModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((userData) => {
      res.status(HTTP_STATUS_CREATED).send({
        name: userData.name,
        about: userData.about,
        avatar: userData.avatar,
        email: userData.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(`Некорректные данные: ${err.name}`));
      }
      return next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  return userModel.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((response) => res.status(HTTP_STATUS_OK).send(response))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(`Некорректные данные: ${err.name}`));
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return userModel.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((response) => { res.status(HTTP_STATUS_OK).send(response); })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(`Некорректные данные: ${err.name}`));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password, (error, isValid) => {
        if (isValid) {
          const token = jwt.sign({ _id: user._id }, JWT_SECRET);
          return res.status(HTTP_STATUS_OK).send({ JWT: token });
        }
        return next(new UnauthorizedError('Неправильные почта или пароль'));
      });
    })
    .catch(next);
};

module.exports = {
  getUser,
  getUsers,
  getUserById,
  postUser,
  updateUser,
  updateAvatar,
  login,
  JWT_SECRET,
};
