'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      // Transaction belongs to one User
      models.Transaction.belongsTo(models.User, {
        foreignKey: 'userId', 
      });

      // Transaction has many TransactionItems (Line Items)
      models.Transaction.hasMany(models.TransactionItem, {
        foreignKey: 'transactionId', 
      });
    }
  }
  Transaction.init({
    userId: DataTypes.INTEGER,
    totalPrice: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};