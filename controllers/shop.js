const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
        });
    } catch (e) {
        console.log();
    }
};

exports.getProduct = async (req, res, next) => {
    const id = req.params.productId;

    try {
        const product = await Product.findById(id);

        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products',
        });
    } catch (e) {
        console.log(e);
    }
};

exports.getIndex = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
        });
    } catch (e) {
        console.log(e);
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const user = await req.user
            .populate('cart.items.productId')
            .execPopulate();
        const products = user.cart.items;
        res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products,
        });
    } catch (e) {
        console.log(e);
    }
};

exports.postCart = async (req, res, next) => {
    try {
        const id = req.body.productId;
        const product = await Product.findById(id);
        await req.user.addToCart(product);

        res.redirect('/cart');
    } catch (e) {
        console.log(e);
    }
};

exports.postCartDeleteProduct = async (req, res, next) => {
    try {
        const id = req.body.productId;
        await req.user.removeFromCart(id)
        res.redirect('/cart');
    } catch (e) {
        console.log(e)
    }
};

exports.postOrder = async (req, res, next) => {
    try {
        const user = await req.user.populate('cart.items.productId').execPopulate();
        const products = user.cart.items.map((i) => {
            return {
                quantity: i.quantity,
                product: { ...i.productId._doc },
            };
        });
        const order = await new Order({
            user: {
                name: req.user.name,
                userId: req.user,
            },
            products: products,
        });
        await order.save();
        req.user.clearCart();
        res.redirect('/orders');
    } catch (e) {
        console.log(e)
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ 'user.userId': req.user._id });
        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Your Orders',
            orders: orders,
        });
    } catch (e) {
        console.log(e)
    }
};
