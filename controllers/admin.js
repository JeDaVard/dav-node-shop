const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',

        path: '/admin/add-product',
        editing: false,
    });
};

exports.postAddProduct = async (req, res) => {
    const { title, price, description } = req.body;
    const image = req.file
    const userId = req.user;

    try {
        const product = await new Product({
            title,
            price,
            description,
            imageUrl: image.path,
            userId,
        });
        await product.save();

        res.redirect('/admin/products');
    } catch (e) {
        console.log(e);
    }
};

exports.getEditProduct = async (req, res) => {
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

exports.postEditProduct = async (req, res) => {
    const { productId, title, price, description } = req.body;
    const image = req.file

    try {
        const product = await Product.findById(productId);

        product.title = title;
        product.price = price;
        product.description = description;
        if (image) product.imageUrl = image.path;

        await product.save()

        res.redirect('/admin/products');
    } catch (e) {
        console.log(e);
    }
};

exports.getProducts = async (req, res) => {
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

exports.postDeleteProduct = async (req, res) => {
    const id = req.body.productId;
    try {
        await Product.findByIdAndRemove(id)
        res.redirect('/admin/products');
    } catch (e) {
        console.log(e)
    }
};