const express = require('express');
const shopController = require('../controllers/shop');
const authController = require('../controllers/auth');

const router = express.Router();


router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);

router.route('/cart')
    .get(shopController.getCart)
    .post(shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);
router.post('/create-order', shopController.postOrder);

router.use(authController.protectRoutes)
router.get('/orders', shopController.getOrders);

module.exports = router;
