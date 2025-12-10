'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    static associate(models) {
      // Setiap Foto milik satu Produk
      this.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }
  ProductImage.init({
    productId: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProductImage',
  });
  return ProductImage;
};