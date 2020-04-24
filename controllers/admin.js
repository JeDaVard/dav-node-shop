const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
    });
};

exports.postAddProduct = async (req, res, next) => {
    try {
        const { title, price, imageUrl, description } = req.body;
        await req.user.createProduct({
            title,
            price,
            imageUrl,
            description,
            userId: req.user.id
        })
        res.redirect('/');
    } catch (e) {
        console.log(e);
    }
};

exports.getEditProduct = async (req, res, next) => {
    try {
        const editMode = req.query.edit;
        if (!editMode) {
            return res.redirect('/');
        }
        const id = req.params.productId;
        const products = await req.user.getProducts({where: { id }})

        if (!products[0]) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            products: products[0]
        });
    } catch (e) {
        console.log(e);
    }
};

exports.postEditProduct = async (req, res, next) => {
    try {
        const prodId = req.body.productId;
        const { title, price, imageUrl, description } = req.body;

        const product = await Product.findByPk(prodId);
        await product.update({ title, price, imageUrl, description });
        product.save();

        res.redirect('/admin/products');
    } catch (e) {
        console.log(e);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const products = await req.user.getProducts();

        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    } catch (e) {
        console.log(e);
    }
};

exports.postDeleteProduct = async (req, res, next) => {
    try {
        const id = req.body.productId;
        await Product.destroy({ where: { id } });

        res.redirect('/admin/products');
    } catch (e) {
        console.log(e);
    }
};
