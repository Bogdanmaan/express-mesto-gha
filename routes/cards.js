const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
// eslint-disable-next-line no-useless-escape
const urlRegExp = /http[s]?:\/\/(www\.)?[\w\d\-\._~:\?#@!$&'()*+,;=[]+#?/im;

const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.delete(
  '/cards/:cardId',
  celebrate({
    body: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteCardById,
);

router.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(urlRegExp),
      owner: Joi.object(),
      likes: Joi.array(),
      createdAt: Joi.date(),
    }),
  }),
  createCard,
);

router.put(
  '/cards/:cardId/likes',
  celebrate({
    body: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),
    }),
  }),
  likeCard,
);

router.delete(
  '/cards/:cardId/likes',
  celebrate({
    body: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),
    }),
  }),
  dislikeCard,
);

module.exports = router;
