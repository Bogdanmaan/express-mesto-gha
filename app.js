const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const { errors, celebrate, Joi } = require('celebrate');
const { createUser, login } = require('./controllers/users');

const userRouter = require('./routes/users');

const cardRouter = require('./routes/cards');

const auth = require('./middlewares/auth');

const NotFoundError = require('./errors/not-found-error');
const errorHandler = require('./middlewares/error-handler');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.use(auth);

app.use(userRouter);
app.use(cardRouter);

app.use('*', (req, res, next) => {
  next(new NotFoundError({ message: 'Несуществующий адрес' }));
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
