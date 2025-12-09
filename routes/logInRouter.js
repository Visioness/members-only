const { Router } = require('express');
const {
  getLogInForm,
  submitLogInForm,
} = require('../controllers/logInController');

const router = Router();

router.get('/', getLogInForm);
router.post('/', submitLogInForm);

module.exports = router;
