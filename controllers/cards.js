const Card = require("../models/cards");
const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");

// const ERROR_CODE_NOT_FOUND = 404;
// const ERROR_CODE = 400;
// const ERROR = 500;
const NO_ERR = 200;
const NO_ERROR = 201;

const getCards = (req, res, next) =>
  Card.find({})
    .then((cards) => res.status(NO_ERR).send(cards))
    .catch((err) => next(err));

const createCard = (req, res) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((card) => card.populate("owner"))
    .then((newCard) => res.status(NO_ERR).send(newCard))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError({ message: "Некорректные данные" });
      }
      next(err);
      // return res.status(ERROR).send({ message: "Ошибка" });
    });
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError({ message: "Карточка не найдена" });
      }
      return res.status(NO_ERR).send({ message: "Карточка удалена" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError({ message: "Некорректные данные" });
      }
      next(err);
      // return res.status(ERROR).send({ message: `Ошибка ${err}` });
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError({ message: "Карточка не найдена" });
      }
      return res.status(NO_ERROR).send({ message: "Вы поставили лайк" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError({ message: "Некорректные данные" });
      }
      next(err);
      // return res.status(ERROR).send({ message: "Ошибка" });
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError({ message: "Карточка не найдена" });
      }
      return res.status(NO_ERR).send({ message: "Ваш лайк удалён" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError({ message: "Некорректные данные" });
      }
      next(err);
      // return res.status(ERROR).send({ message: "Ошибка" });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
