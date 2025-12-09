'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Insert dummy data into 'Products' table
    await queryInterface.bulkInsert('Products', [
      {
        name: 'Beras Pandan Wangi 5kg',
        price: 75000,
        stock: 100,
        description: 'Beras pulen dengan aroma pandan alami.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Minyak Goreng 2L',
        price: 32000,
        stock: 50,
        description: 'Minyak goreng kelapa sawit jernih.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Gula Pasir 1kg',
        price: 14000,
        stock: 200,
        description: 'Gula tebu asli warna putih bersih.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Telur Ayam 1kg',
        price: 28000,
        stock: 30,
        description: 'Telur ayam negeri segar.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    // Command to revert/delete the data if needed
    await queryInterface.bulkDelete('Products', null, {});
  }
};