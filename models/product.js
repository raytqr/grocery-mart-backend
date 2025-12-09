'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Product has many CartItems (Shopping Cart)
      this.hasMany(models.CartItem, { foreignKey: 'productId' });

      // Product juga punya banyak TransactionItem (Riwayat Pembelian)
      this.hasMany(models.TransactionItem, { foreignKey: 'productId' });
    }
  }
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    image: DataTypes.STRING // ✅ Ini baris kuncinya
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};