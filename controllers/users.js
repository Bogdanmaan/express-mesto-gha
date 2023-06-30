const User = require('../models/users');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((err) => res.status(500).send({ message: `Ошибка ${err}` }));

const getUserById = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      const ERROR_CODE = 404;
      if (!user) {
        return res.status(ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => res.status(500).send({ message: `Ошибка ${err}` }));
};

const createUser = (req, res) => {
  const newUserData = req.body;

  return User.create(newUserData)
    .then((newUser) => res.status(201).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Некорректные данные' });
      }
      return res.status(500).send({ message: 'Ошибка' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(400).send({ message: 'Некорректные данные' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => res.status(500).send({ message: `Ошибка ${err}` }));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Некорректные данные' });
      }
      return res.status(500).send({ message: 'Ошибка' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
