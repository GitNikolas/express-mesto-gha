const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const router = require('./routes');

const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
}).then(() => console.log('Connected to mongodb'));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64db4aee6b8e063717eaeab2',
  };
  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
