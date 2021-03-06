const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();


router.route('/login').get(authController.getLogin).post(authController.postLogin);
router.route('/signup').get(authController.getSignup).post(authController.postSignup);
router.post('/logout', authController.postLogout)

module.exports = router