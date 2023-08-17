const router = require('express').Router();
const consoleLoggerMidleware = require('../midlewares/consoleLoggerMidleware');
const userAuthMidleware = require('../midlewares/userAuthMidleware');

router.use(consoleLoggerMidleware);
router.use(userAuthMidleware);

const userRouter = require('./users');
const cardRouter = require('./cards');

router.use(userRouter);
router.use(cardRouter);

module.exports = router;
