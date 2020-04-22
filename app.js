const path = require('path');

const express = require('express');

const app = express();

// Route requirement
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// express default bodyParser
// app.use(express.json())
app.use(express.urlencoded({ extended: false }));
// Static root
app.use(express.static(path.join(__dirname, 'public')));

// Routing middleware
app.use('/admin', adminData.routes);
app.use(shopRoutes);
app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

module.exports = app