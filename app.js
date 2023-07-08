const express = require("express");

const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const { createUser, login } = require("./controllers/users");

const userRouter = require("./routes/users");

const cardRouter = require("./routes/cards");

const auth = require("./middlewares/auth");

const { errors, celebrate, Joi } = require("celebrate");

const ERROR_CODE_NOT_FOUND = 404;

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

// app.use((req, res, next) => {
//   req.user = {
//     _id: "64999590c6b176cf817db3c6",
//   };

//   next();
// });

app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);
app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);

app.use(auth);

app.use(userRouter);
app.use(cardRouter);

app.use("*", (req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: "Несуществующий адрес" });
});

app.use(errors());

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
