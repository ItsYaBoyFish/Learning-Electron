  const Sequelize = require('sequelize');
const db = require('../connection');

var Users = db.define('tblUsers', {
  
  ID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  Username: Sequelize.STRING,
  Password: Sequelize.STRING
}, {
  freezeTableName: true,
  timestamps: false
});

Users.sync();

module.exports = Users;