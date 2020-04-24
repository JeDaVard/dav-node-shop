const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
    });
};

exports.postAddProduct = async (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;
    const userId = req.user;

    try {
        const product = await new Product({
            title,
            price,
            description,
            imageUrl,
            userId,
        });
        await product.save();

        res.redirect('/admin/products');
    } catch (e) {
        console.log(e);
    }
};

exports.getEditProduct = async (req, res, next) => {
    const prodId = req.params.productId;
    const editMode = req.query.edit;
    if (!editMode) return res.redirect('/');

    try {
        const product = await Product.findById(prodId);
        if (!product) return res.redirect('/');

        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product,
        });
    } catch (e) {
        console.log(e);
    }
};

exports.postEditProduct = async (req, res, next) => {
    const { prodId, title, price, imageUrl, description } = req.body;

    try {
        await Product.findByIdAndUpdate(prodId, {
            title,
            price,
            imageUrl,
            description,
        });

        res.redirect('/admin/products');
    } catch (e) {
        console.log(e);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();

        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    } catch (e) {
        console.log(e)
    }
};

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    try {
        Product.findByIdAndRemove(id)
        res.redirect('/admin/products');
    } catch (e) {
        console.log(e)
    }
};
