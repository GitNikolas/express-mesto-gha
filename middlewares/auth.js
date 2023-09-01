const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'testSecretCode' } = process.env;
const UnauthorizedError = require('../errors/unauthorized-error');

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Некорректный токен'));
  }

  req.user = payload;

  return next();
}

module.exports = auth;
