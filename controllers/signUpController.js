const db = require('../db/queries');
const { body, validationResult, matchedData } = require('express-validator');
const bcrypt = require('bcryptjs');

const signUpValidation = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name can not be empty.'),
  body('lastName').trim().notEmpty().withMessage('Last name can not be empty.'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username can not be empty.')
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
    .isLength({ min: 5 })
    .withMessage('Password must contain 5 characters at least.'),
  body('confirmPassword')
    .trim()
    .notEmpty()
    .withMessage('Confirm Password can not be empty.')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords can not be different.'),
  body('adminCode').optional(),
];

const getSignUpForm = (req, res) => {
  if (res.locals.currentUser) {
    return res.redirect('/');
  }

  res.render('sign-up-form');
};

const submitSignUpForm = [
  signUpValidation,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('sign-up-form', {
        errors: errors.array(),
      });
    }

    try {
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
