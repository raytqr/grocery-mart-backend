'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionItem extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {
      // 1. 🔑 TransactionItem belongs to one Transaction (The Order Header)
      models.TransactionItem.belongsTo(models.Transaction, {
        foreignKey: 'transactionId', // FK yang ada di tabel TransactionItems
      });

      // 2. 🔑 TransactionItem belongs to one Product (The actual item)
      models.TransactionItem.belongsTo(models.Product, {
        foreignKey: 'productId', // FK yang ada di tabel TransactionItems
      });
    }
  }
  TransactionItem.init({
    transactionId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER // Harga saat pembelian terjadi (Snapshot price)
  }, {
    sequelize,
    modelName: 'TransactionItem',
  });
  return TransactionItem;
};