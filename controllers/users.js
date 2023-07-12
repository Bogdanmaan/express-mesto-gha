const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');
const ForbiddenError = require('../errors/forbidden-error');

const NO_ERR = 200;
const NO_ERROR = 201;

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(NO_ERR).send(users))
  .catch((err) => next(err));

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError({
          message: 'Запрашиваемый пользователь не найден',
        });
      }
      return res.status(NO_ERR).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError({ message: 'Некорректные данные' }));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .then((newUser) => {
      if (newUser) {
        throw new ConflictError({ message: 'Пользователь уже существует' });
      }
      bcrypt.hash(password, 10)
        .then((hash) => User.create({ email, password: hash })
          .then((user) => res.status(NO_ERROR).send(user)));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError({ message: 'Некорректные данные' }));
      }
      return next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError({
          message: 'Запрашиваемый пользователь не найден',
        });
      }
      return res.status(NO_ERR).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError({ message: 'Некорректные данные' }));
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError({ message: 'Некорректные данные' }));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .select('+password')
    .then((newUser) => {
      if (!newUser) {
        throw new ForbiddenError({ message: 'Пользователь не существует' });
      }
      bcrypt.compare(password, newUser.password).then((matched) => {
        if (!matched) {
          return next(
            new ForbiddenError({
              message: 'Не правильный почта или пароль',
            }),
          );
        }
        const token = jwt.sign({ _id: newUser._id }, 'secretKey', {
          expiresIn: '7d',
        });
        return res.status(NO_ERROR).send({ token });
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError({ message: 'Некорректные данные' }));
      }
      return next(err);
    });
};

const getDataUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getDataUser,
};
