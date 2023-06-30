const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const userRouter = require('./routes/users');

const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '64999590c6b176cf817db3c6',
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
