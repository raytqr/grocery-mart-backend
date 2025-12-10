'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Product has many CartItems (Shopping Cart)
      this.hasMany(models.CartItem, { foreignKey: 'productId' });

      this.hasMany(models.TransactionItem, { foreignKey: 'productId' });

      this.hasMany(models.ProductImage, { foreignKey: 'productId', as: 'images' });
    }
  }
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};