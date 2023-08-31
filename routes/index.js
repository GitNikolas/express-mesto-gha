const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const consoleLoggerMiddleware = require('../middlewares/consoleLoggerMiddleware');
const auth = require('../middlewares/auth');

const NotFoundError = require('../errors/not-found-error');

router.use(consoleLoggerMiddleware);

const userRouter = require('./users');
const cardRouter = require('./cards');
const { login, postUser } = require('../controllers/users');

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().regex(/https?:\/\/(www\.)?[\w\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]+\#?$/i),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), postUser);

router.use('*', (req, res, next) => next(new NotFoundError('Запрашиваемая страница не найдена')));

module.exports = router;
