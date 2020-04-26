const Product = require('../models/product');
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',

            path: '/products',
        });
    } catch (e) {
        console.log(e);
    }
};

exports.getProduct = async (req, res) => {
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


exports.getIndex = async (req, res) => {
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

exports.getCart = async (req, res) => {
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

exports.postCart = async (req, res) => {
    try {
        const id = req.body.productId;
        const product = await Product.findById(id);
        await req.user.addToCart(product);

        res.redirect('/cart');
    } catch (e) {
        console.log(e);
    }
};

exports.postCartDeleteProduct = async (req, res) => {
    try {
        const id = req.body.productId;
        await req.user.removeFromCart(id)
        res.redirect('/cart');
    } catch (e) {
        console.log(e)
    }
};

exports.postOrder = async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.productId').execPopulate();
        const products = user.cart.items.map((i) => {
            return {
                quantity: i.quantity,
                product: { ...i.productId._doc },
            };
        });

        const amount = products.map( prod => {
            return prod.quantity * prod.product.price
        }).reduce((sum, cur) => sum + cur, 0);

        const order = await new Order({
            user: {
                name: req.user.name,
                userId: req.user,
            },
            products: products,
            amount
        });
        await order.save();
        req.user.clearCart();
        res.redirect('/orders');
    } catch (e) {
        console.log(e)
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 'user.userId': req.user._id });
        console.log(orders[0].products)
        res.render('shop/orders', {
            path: '/orders',

            pageTitle: 'Your Orders',
            orders: orders,
        });
    } catch (e) {
        console.log(e)
    }
};

exports.getInvoice = async (req, res, next) => {
    try {
        const id = req.params.orderId;
        const invoiceName = 'invoice-'+id+'.pdf';
        const invoicePath = path.join('data', 'invoices', invoiceName);

        fs.readFile(invoicePath, (err, data) => {
            if (err) return next(err);
            res.send(data)
        })
    } catch (e) {
        console.log(e);
    }
}