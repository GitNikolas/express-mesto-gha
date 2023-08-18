const router = require('express').Router();
const consoleLoggerMidleware = require('../midlewares/consoleLoggerMidleware');

router.use(consoleLoggerMidleware);

const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res) => res.status(404).send({ message: 'Запрашиваемая страница не найдена' }));

module.exports = router;
