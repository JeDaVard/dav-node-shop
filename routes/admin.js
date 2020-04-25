const express = require('express');
const adminController = require('../controllers/admin');
const authController = require('../controllers/auth');

const router = express.Router();

router.use(authController.protectRoutes)

router.route('/add-product')
    .get(adminController.getAddProduct)
    .post(adminController.postAddProduct)

router.get('/products', adminController.getProducts);
router.get('/edit-product/:productId', adminController.getEditProduct);
router.post('/edit-product', adminController.postEditProduct);
router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
