const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { errors } = require('celebrate');
const router = require('./routes');
const errorParser = require('./middlewares/errorParser');

const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
}).then(() => console.log('Connected to mongodb'));

const app = express();

app.use(express.json());

app.use(router);

app.use(errors());

app.use(errorParser);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
