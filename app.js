const path = require('path');

const express = require('express');
const sequelize = require('./util/database');

// Models
const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

// Route requirement
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error')

// Template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// express default bodyParser
// app.use(express.json())
app.use(express.urlencoded({ extended: false }));
// Static root
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then( user => {
            req.user = user;
            next()
        })
        .catch( e => console.log(e) )
})
// Routing middleware
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);


// Data relations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE'});
Product.belongsToMany(Cart, { through: CartItem })
User.hasMany(Product);
User.hasOne(Cart);
User.hasMany(Order)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through: CartItem })
Cart.hasMany(CartItem);
CartItem.belongsTo(Cart);
Order.belongsTo(User)
Order.belongsToMany(Product, { through: OrderItem})

sequelize
    // .sync({ force: true })
    .sync()
    .then(() => User.findByPk(1))
    .then( user => {
        if (!user) return User.create({name: 'David', email: 'test@test.com'});
        return user
    })
    .catch( e => console.log(e));

module.exports = app