const jwt = require('jsonwebtoken');

const AuthError = require('../errors/auth-error');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок

  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    // попытаемся верифицировать токен

    payload = jwt.verify(token, 'secretKey');
  } catch (err) {
    // отправим ошибку, если не получилось

    return next(new AuthError({ message: 'Необходима авторизация' }));
  }

  req.user = payload;

  return next();
};
