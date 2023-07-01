const User = require('../models/users');

const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE = 400;
const ERROR = 500;
const NO_ERR = 200;
const NO_ERROR = 201;

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(NO_ERR).send(users))
  .catch((err) => res.status(ERROR).send({ message: `Ошибка ${err}` }));

const getUserById = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(NO_ERR).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Некорректные данные' });
      }
      return res.status(ERROR).send({ message: 'Ошибка' });
    });
};

const createUser = (req, res) => {
  const newUserData = req.body;

  return User.create(newUserData)
    .then((newUser) => res.status(NO_ERROR).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Некорректные данные' });
      }
      return res.status(ERROR).send({ message: 'Ошибка' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.status(NO_ERR).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Некорректные данные' });
      }
      return res.status(ERROR).send({ message: `Ошибка ${err}` });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Некорректные данные' });
      }
      return res.status(ERROR).send({ message: 'Ошибка' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
