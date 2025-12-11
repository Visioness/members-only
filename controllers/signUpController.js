const db = require('../db/queries');
const { body, validationResult, matchedData } = require('express-validator');
const bcrypt = require('bcryptjs');

const signUpValidation = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name can not be empty.')
    .isLength({ min: 1, max: 30 })
    .withMessage('First name must be between 1 and 30 characters.'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name can not be empty.')
    .isLength({ min: 1, max: 30 })
    .withMessage('Last name must be between 1 and 30 characters.'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username can not be empty.')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters.')
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers.')
    .custom(async (value) => {
      const user = await db.getUserByUsername(value);
      if (user != undefined) {
        return Promise.reject('Username already taken, try another one.');
      }
      return true;
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password can not be empty.')
    .isLength({ min: 8 })
    .withMessage('Password must contain 8 characters at least.'),
  body('confirmPassword')
    .trim()
    .notEmpty()
    .withMessage('Confirm Password can not be empty.')
    .custom((value, { req }) => {
      return value === req.body.password.trim();
    })
    .withMessage('Passwords can not be different.'),
  body('adminCode').optional(),
];

const getSignUpForm = (req, res, next) => {
  try {
    if (res.locals.currentUser) {
      return res.redirect('/');
    }

    res.render('sign-up-form');
  } catch (error) {
    next(error);
  }
};

const submitSignUpForm = [
  signUpValidation,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render('sign-up-form', {
          errors: errors.array(),
        });
      }

      const { firstName, lastName, username, password, adminCode } =
        matchedData(req);
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.createUser(
        firstName,
        lastName,
        username,
        hashedPassword,
        false,
        adminCode === process.env.ADMIN_CODE
      );
      res.redirect('/log-in');
    } catch (error) {
      next(error);
    }
  },
];

module.exports = { getSignUpForm, submitSignUpForm };
