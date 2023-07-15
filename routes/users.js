const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getDataUser,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', getDataUser);

router.get(
  '/users/:userId',
  celebrate({
    body: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  getUserById,
);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
