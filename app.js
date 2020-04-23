const path = require('path');

const express = require('express');

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

// Routing middleware
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

module.exports = app