/* eslint-disable no-unused-vars */
const User = require('../models/users');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users));

const getUserById = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => res.status(500).send({ message: 'Ошибка' }));
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
  User.findByIdAndUpdate(req.user._id)
    .then((user) => res.status(200).send(user));
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: 'https://yandex.ru/images/search?text=картинки&img_url=https%3A%2F%2Fwww.1zoom.me%2Fbig2%2F541%2F255095-Sepik.jpg&pos=1&rpt=simage&stype=image&lr=213&parent-reqid=1687787311559725-15310763039287171511-balancer-l7leveler-kubr-yp-sas-159-BAL-1744&source=serp' })
    .then((user) => res.send({ data: user }));
};

// const deleteUserById = (req, res) => {};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
