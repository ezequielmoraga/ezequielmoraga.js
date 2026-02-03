'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Habilitaciones', [
      { id_chofer: 1, id_vehiculo: 2,  createdAt: new Date(), updatedAt: new Date() },
      { id_chofer: 1, id_vehiculo: 4,  createdAt: new Date(), updatedAt: new Date() },
      { id_chofer: 1, id_vehiculo: 12, createdAt: new Date(), updatedAt: new Date() },
      { id_chofer: 3, id_vehiculo: 6,  createdAt: new Date(), updatedAt: new Date() },
      { id_chofer: 9, id_vehiculo: 2,  createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Habilitaciones', null, {});
  }
};
