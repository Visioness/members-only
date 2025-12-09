const { Router } = require('express');
const {
  getAllMessages,
  submitSecretForm,
  createMessage,
  deleteMessage,
} = require('../controllers/indexController');

const router = Router();

router.get('/', getAllMessages);
router.post('/secret', submitSecretForm);
router.post('/messages/new', createMessage);
router.post('/messages/:messageId/delete', deleteMessage);

module.exports = router;
