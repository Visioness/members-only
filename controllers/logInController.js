const passport = require('passport');

const getLogInForm = (req, res, next) => {
  try {
    if (res.locals.currentUser) {
      return res.redirect('/');
    }

    res.render('log-in-form', { errors: req.flash('error') });
  } catch (error) {
    next(error);
  }
};

const submitLogInForm = (req, res, next) => {
  try {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/log-in',
      failureFlash: true,
    })(req, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports = { getLogInForm, submitLogInForm };
