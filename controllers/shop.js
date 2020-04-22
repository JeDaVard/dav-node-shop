const adminProducts = require('./admin');

exports.getProducts = (req, res, next) => {
    const products = adminProducts;
    res.render('shop', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
}