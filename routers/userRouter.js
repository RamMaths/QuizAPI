const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router
  .route('/register')
  .post(userController.createUser);

router
  .route('/validate')
  .post(userController.validateUser);

module.exports = router;
