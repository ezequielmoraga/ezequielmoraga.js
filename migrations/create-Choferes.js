'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Choferes', {
      id_chofer: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      nombre: Sequelize.STRING,
      apellido: Sequelize.STRING,
      dni: Sequelize.STRING,
      licencia: Sequelize.STRING,
      edad: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Choferes');
  }
};
