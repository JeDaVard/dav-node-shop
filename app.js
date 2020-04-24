const path = require('path');

const express = require('express');

const app = express();
const mongoose = require('mongoose');

const User = require('./models/user');

// Route requirement
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

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
    User.findById('5ea312cf7b07b800c7e871e1')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

// Routing middleware
app.use('/admin', adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);
app.use(errorController.get404);


mongoose
    .connect(
        'mongodb+srv://davit:vardanyan@cluster0-sfzxj.mongodb.net/test?retryWrites=true&w=majority',
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Max',
                    email: 'max@test.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });
    })
    .catch(err => {
        console.log(err);
    });

module.exports = app