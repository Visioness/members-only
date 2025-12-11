const db = require('../db/queries');
const { body, validationResult, matchedData } = require('express-validator');

const messageValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title can not be empty.')
    .isLength({ min: 1, max: 60 })
    .withMessage('Title must be between 1 and 60 characters.'),
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Text can not be empty.')
    .isLength({ min: 1, max: 500 })
    .withMessage('Text must be between 1 and 500 characters.'),
];

const getAllMessages = async (req, res, next) => {
  try {
    const messages = await db.getAllMessages();
    res.render('index', { messages });
  } catch (error) {
    next(error);
  }
};

const submitSecretForm = [
  body('secretCode')
    .trim()
    .notEmpty()
    .withMessage('Secret Code can not be empty.'),
  async (req, res, next) => {
    try {
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
    } catch (error) {
      next(error);
    }
  },
];

const createMessage = [
  messageValidation,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render('index', {
          errors: errors.array(),
        });
      }

      const { title, text } = matchedData(req);
      await db.createMessage(res.locals.currentUser.id, title, text);
      res.redirect('/');
    } catch (error) {
      next(error);
    }
  },
];

const deleteMessage = async (req, res, next) => {
  try {
    if (!res.locals.currentUser || !res.locals.currentUser.is_admin) {
      return res.status(403).render('index', {
        errors: [{ msg: 'You do not have permissions to delete messages.' }],
      });
    }

    const { messageId } = req.params;
    const isExistingMessage = await db.getMessageById(messageId);

    if (isExistingMessage == undefined) {
      return res.status(400).render('index', {
        errors: [{ msg: 'Could not find the requested message.' }],
      });
    }

    await db.deleteMessage(messageId);
    res.redirect('/');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMessages,
  submitSecretForm,
  createMessage,
  deleteMessage,
};
