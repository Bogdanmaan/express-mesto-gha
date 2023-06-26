const Card = require('../models/cards');

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send(cards));

const createCard = (req, res) => {
  const newCardData = req.body;

  return Card.create(newCardData)
    .then((newCard) => res.status(201).send(newCard));
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
    .then((card) => res.status(201).send(card));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.status(201).send(card));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.status(201).send(card));
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
