const path = require('path');

const express = require('express');
const csrf = require('csurf');
const csrfProtection = csrf();

const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
    uri: 'mongodb+srv://davit:vardanyan@cluster0-sfzxj.mongodb.net/test?retryWrites=true&w=majority',
    collection: 'sessions'
});

// Route requirement
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


// Template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Cookie parser
// app.use(cookieParser())
// Session
app.use(session({secret: 'mysecret', resave: false, saveUninitialized: false, store}))
// express default bodyParser
// app.use(express.json())
app.use(express.urlencoded({ extended: false }));
// Static root
app.use(express.static(path.join(__dirname, 'public')));
// csrf protection
app.use(csrfProtection)
// Auth middleware
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next()
})

app.use(async (req, res, next) => {
    if (!req.session.user) return next();
    req.user = await User.findById(req.session.user._id)
    next()
})

// Routing middleware
app.use('/admin', adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoose
    .connect(
        'mongodb+srv://davit:vardanyan@cluster0-sfzxj.mongodb.net/test?retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        }
    )
    .then(() => {
        User.findOne().then((user) => {
            if (!user) {
                const user = new User({
                    name: 'David',
                    email: 'dav@test.com',
                    cart: {
                        items: [],
                    },
                });
                user.save();
            }
        });
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = app;
