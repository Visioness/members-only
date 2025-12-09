const passport = require('passport');

const getLogInForm = (req, res) => {
  if (res.locals.currentUser) {
    return res.redirect('/');
  }

  res.render('log-in-form', { errors: req.flash('error') });
};

const submitLogInForm = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/log-in',
  failureFlash: true,
});

module.exports = { getLogInForm, submitLogInForm };
