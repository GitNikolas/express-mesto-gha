const router = require('express').Router();
const consoleLoggerMidleware = require('../midlewares/consoleLoggerMidleware');

router.use(consoleLoggerMidleware);

const userRouter = require('./users');
const cardRouter = require('./cards');

router.use(userRouter);
router.use(cardRouter);

module.exports = router;
