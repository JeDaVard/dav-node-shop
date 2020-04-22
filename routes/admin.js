const express = require('express');
const adminController = require('../controllers/admin');

const router = express.Router();


router.route('/add-product')
    .get(adminController.getProducts)
    .post(adminController.addProduct);

module.exports = router