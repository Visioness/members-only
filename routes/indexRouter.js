const { Router } = require('express');
const {
  getAllMessages,
  submitSecretForm,
  createMessage,
} = require('../controllers/indexController');

const router = Router();

router.get('/', getAllMessages);
router.post('/secret', submitSecretForm);
router.post('/messages/new', createMessage);

module.exports = router;
