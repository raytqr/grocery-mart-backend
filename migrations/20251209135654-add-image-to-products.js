'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Menambahkan kolom 'image' bertipe STRING ke tabel 'Products'
    await queryInterface.addColumn('Products', 'image', {
      type: Sequelize.STRING,
      allowNull: true, // Kita buat true agar produk lama yang belum punya gambar tidak error
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Menghapus kolom jika migrasi dibatalkan
    await queryInterface.removeColumn('Products', 'image');
  }
};