const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

router.get("/cards", getCards);

router.delete("/cards/:cardId", deleteCardById);

router.post(
  "/cards",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required(),
      owner: Joi.object(),
      likes: Joi.array(),
      createdAt: Joi.date(),
    }),
  }),
  createCard
);

router.put("/cards/:cardId/likes", likeCard);

router.delete("/cards/:cardId/likes", dislikeCard);

module.exports = router;
