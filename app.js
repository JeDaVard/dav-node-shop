const path = require('path');

const express = require('express');
const csrf = require('csurf');
const csrfProtection = csrf();
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');
const { storage, fileFilter } = require('./util/multerConfilg');
// const cookieParser = require('cookie-parser');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions',
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
app.use(
    session({
        secret: 'mysecret',
        resave: false,
        saveUninitialized: false,
        store,
    })
);

// express default bodyParser
// app.use(express.json())
app.use(express.urlencoded({ extended: false }));
// multer binary parser for files (image upload for "add product")
app.use(multer({ storage, fileFilter }).single('image'));
// Static
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
// csrf protection
app.use(csrfProtection);
// helmet (security headers)
app.use(helmet())
// compress response size
app.use(compression())
// Auth middleware
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(async (req, res, next) => {
    if (!req.session.user) return next();
    req.user = await User.findById(req.session.user._id);
    next();
});

// Routing middleware
app.use('/admin', adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
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
