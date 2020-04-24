const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll();

        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
        });
    } catch (e) {
        console.log(e);
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const prodId = req.params.productId;

        const product = await Product.findByPk(prodId);

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
        const products = await Product.findAll();

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
        const cart = await req.user.getCart();
        const products = await cart.getProducts();

        res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products,
        });
    } catch (e) {
        console.log(e);
    }
};

exports.postCart = async (req, res, next) => {
    const id = req.body.productId;
    let fetchedCart;

    try {
        const cart = await req.user.getCart();
        fetchedCart = cart;
        const products = await cart.getProducts({ where: { id } });

        console.log()

        let existingProduct;
        if (products[0]) {
            existingProduct = products[0];
            const newQuantity =
                existingProduct.dataValues.cartItem.dataValues.quantity + 1;
            fetchedCart.addProduct(existingProduct, {
                through: { quantity: newQuantity },
            });
        } else {
            const prod = await Product.findByPk(id);
            fetchedCart.addProduct(prod, { through: { quantity: 1 } });
        }

        res.redirect('/cart');
    } catch (e) {
        console.log(e);
    }
};

exports.postCartDeleteProduct = async (req, res, next) => {
    const id = req.body.productId;
    try {
        const cart = await req.user.getCart();
        const [product] = await cart.getProducts({ where: { id } });

        await product.dataValues.cartItem.destroy()

        res.redirect('/cart');
    } catch (e) {
        console.log(e);
    }
};

exports.postOrder = async (req, res, next) => {
    try {
        const cart = await req.user.getCart();
        let fetchedCart = cart;
        const products = await cart.getProducts();
        const newOrder = await req.user.createOrder();
        await newOrder.addProducts(products.map( prod => {
            prod.orderItem = { quantity: prod.cartItem.quantity };
            return prod
        }));

        fetchedCart.setProducts(null)

        res.redirect('/orders');
    } catch (e) {
        console.log(e)
    }

};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await req.user.getOrders({include: ['products']});

        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Your Orders',
            orders
        });
    } catch (e) {
        console.log(e)
    }
};