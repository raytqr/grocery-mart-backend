'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Menambahkan kolom 'price' ke tabel TransactionItems
    await queryInterface.addColumn('TransactionItems', 'price', {
      type: Sequelize.INTEGER,
      allowNull: true, // Atau false jika ingin wajib diisi
      defaultValue: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Menghapus kolom 'price' jika migrasi di-undo
    await queryInterface.removeColumn('TransactionItems', 'price');
  }
};