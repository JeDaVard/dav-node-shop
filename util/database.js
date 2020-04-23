const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('dav-node-shop', 'root', `asdfghjkl;'`, {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize