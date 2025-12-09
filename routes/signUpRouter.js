const { Router } = require('express');
const {
  getSignUpForm,
  submitSignUpForm,
} = require('../controllers/signUpController');

const router = Router();

router.get('/', getSignUpForm);
router.post('/', submitSignUpForm);

module.exports = router;
