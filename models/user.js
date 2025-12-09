'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // User has many Transactions (Order History)
      models.User.hasMany(models.Transaction, {
          foreignKey: 'userId',
      });
      
      // User has many CartItems (Shopping Cart)
      models.User.hasMany(models.CartItem, {
          foreignKey: 'userId',
      });
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};