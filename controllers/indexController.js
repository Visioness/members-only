const db = require('../db/queries');
const { body, validationResult, matchedData } = require('express-validator');

const messageValidation = [
  body('title').trim().notEmpty().withMessage('Title can not be empty.'),
  body('text').trim().notEmpty().withMessage('Text can not be empty.'),
];

const getAllMessages = async (req, res) => {
  const messages = await db.getAllMessages();
  res.render('index', { messages });
};

const createMessage = [
  messageValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('/', {
        errors: errors.array(),
      });
    }

    const { title, text } = matchedData(req);
    await db.createMessage(res.locals.currentUser.id, title, text);
    res.redirect('/');
  },
];

const submitSecretForm = [
  body('secretCode')
    .trim()
    .notEmpty()
    .withMessage('Secret Code can not be empty.'),
  async (req, res) => {
    const messages = await db.getAllMessages();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('index', {
        messages,
        errors: errors.array(),
      });
    }

    const { secretCode } = matchedData(req);
    if (process.env.SECRET_CODE.toLowerCase() !== secretCode.toLowerCase()) {
      return res.status(400).render('index', {
        messages,
        errors: [{ msg: 'Incorrect Secret Code!' }],
      });
    }

    await db.addMembership(res.locals.currentUser.id);
    res.redirect('/');
  },
];

module.exports = {
  getAllMessages,
  submitSecretForm,
  createMessage,
};
