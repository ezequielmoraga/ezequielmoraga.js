'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vehiculos', {
      id_vehiculo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      patente: Sequelize.STRING,
      carga_util: Sequelize.REAL,
      licencia_minima: Sequelize.STRING,
      en_uso: Sequelize.INTEGER,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Vehiculos');
  }
};
